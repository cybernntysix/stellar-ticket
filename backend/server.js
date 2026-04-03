require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const csv = require('csv-parser');
const pdf = require('pdf-parse'); // Corrected import name
const musicMetadata = require('music-metadata');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3002;

// --- CTO UTILITIES ---

/**
 * Robustly extracts and parses JSON from LLM output.
 * Handles markdown blocks and preamble text.
 */
const safeJsonParse = (text) => {
  try {
    // Attempt direct parse first
    return JSON.parse(text);
  } catch (e) {
    // Regex to find content between { } or [ ] including the brackets
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim());
      } catch (innerError) {
        throw new Error("Neural Link: Malformed JSON payload detected.");
      }
    }
    throw new Error("Neural Link: No valid JSON block found in response.");
  }
};

/**
 * Prevents Path Traversal attacks by ensuring requested paths 
 * remain within the authorized uploads directory.
 */
const sanitizePath = (unsafePath) => {
  const normalizedPath = path.normalize(unsafePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const rootDir = path.join(__dirname, '../public/uploads');
  const fullPath = path.resolve(path.join(__dirname, '../public', normalizedPath));
  
  if (!fullPath.startsWith(path.resolve(__dirname, '../public'))) {
    throw new Error("Sovereign Security: Unauthorized path access attempted.");
  }
  return fullPath;
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

const UPLOAD_ROOT = path.join(__dirname, '../public/uploads');
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

fs.ensureDirSync(UPLOAD_ROOT);
fs.ensureDirSync(DATA_DIR);

// Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let folder = 'documents';
    if (['.mp3', '.wav', '.flac'].includes(ext)) folder = 'music';
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) folder = 'images';
    if (['.mp4', '.mov'].includes(ext)) folder = 'videos';
    const dest = path.join(UPLOAD_ROOT, folder);
    fs.ensureDirSync(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/api/upload', upload.array('files'), (req, res) => {
  console.log(`UPLOAD: ${req.files.length} files received.`);
  res.json({ message: 'Files uploaded successfully', files: req.files });
});

app.get('/api/assets', async (req, res) => {
  try {
    const folders = ['documents', 'music', 'images', 'videos'];
    let allFiles = [];
    for (const f of folders) {
      const dir = path.join(UPLOAD_ROOT, f);
      if (await fs.pathExists(dir)) {
        const files = await fs.readdir(dir);
        files.forEach(file => {
          if (file !== '.DS_Store') {
            allFiles.push({ name: file, path: `/uploads/${f}/${file}`, folder: f });
          }
        });
      }
    }
    console.log(`ASSETS DISCOVERED: ${allFiles.length} files.`);
    res.json(allFiles);
  } catch (err) { res.status(500).send(err); }
});

app.post('/api/analyze', async (req, res) => {
  const { path: assetPath } = req.body;
  try {
    const fullPath = sanitizePath(assetPath);
    if (!await fs.pathExists(fullPath)) return res.status(404).json({ error: 'Sovereign Archive: File not found' });
    const ext = path.extname(fullPath).toLowerCase();

    if (ext === '.csv') {
      const results = [];
      fs.createReadStream(fullPath).pipe(csv()).on('data', (d) => results.push(d)).on('end', () => res.json({ type: 'csv', data: results }));
    } else if (ext === '.pdf') {
      const dataBuffer = await fs.readFile(fullPath);
      const result = await pdf(dataBuffer);
      res.json({ type: 'pdf', text: result.text || "" });
    } else if (ext === '.txt') {
      const text = await fs.readFile(fullPath, 'utf8');
      res.json({ type: 'txt', text: text });
    } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      const imageBuffer = await fs.readFile(fullPath);
      const base64Image = imageBuffer.toString('base64');
      const result = await model.generateContent(["Analyze this image.", { inlineData: { data: base64Image, mimeType: `image/${ext.replace('.', '')}` } }]);
      const response = await result.response;
      res.json({ type: 'image', text: response.text() });
    } else if (['.mp3', '.wav', '.flac'].includes(ext)) {
      const metadata = await musicMetadata.parseFile(fullPath);
      const techSpecs = `Format: ${metadata.format.container} | Duration: ${metadata.format.duration}s`;
      const result = await model.generateContent(`Analyze audio: ${techSpecs}`);
      const response = await result.response;
      res.json({ type: 'audio', text: response.text() });
    } else {
      res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (err) { 
    console.error("ANALYSIS_ERROR:", err.message);
    res.status(500).json({ error: err.message }); 
  }
});

app.post('/api/summarize', async (req, res) => {
  const { text, customPrompt } = req.body;
  try {
    const prompt = `Return structured JSON: { "summary": "...", "connectiveStatements": [], "discoveredNodes": [], "statement": "..." } CONTEXT: ${text} PROMPT: ${customPrompt}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = safeJsonParse(response.text());
    res.json(data);
  } catch (error) { 
    console.error("SUMMARIZE_ERROR:", error.message);
    res.status(500).json({ error: error.message }); 
  }
});

app.post('/api/generate-visual', async (req, res) => {
  const { prompt } = req.body;
  try {
    const systemPrompt = `Generate ONLY a raw <svg> string for the following request: "${prompt}". \n\nMANDATORY AESTHETIC RULES:\n1. You must output ONLY raw, valid <svg> code. Do not use markdown formatting (no \`\`\`svg or \`\`\`).\n2. Use a minimalist cyberpunk aesthetic.\n3. Use ONLY these colors: Neon Blue (#007AFF), Deep Purple (#AF52DE), and pure white for text. Backgrounds must be transparent or pure black.\n4. Use very thin 1px strokes.\n5. Use sharp, geometric shapes and futuristic sans-serif fonts.\n6. Do not use any gradients unless they are linear from blue to purple.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    
    const raw = response.text().trim();
    const svgMatch = raw.match(/<svg[\s\S]*<\/svg>/);
    res.json({ output: svgMatch ? svgMatch[0] : raw.replace(/```svg/g, '').replace(/```html/g, '').replace(/```/g, '').trim() });
  } catch (error) { 
    console.error("VISUAL_ERROR:", error.message);
    res.status(500).json({ error: error.message }); 
  }
});

// --- PERSISTENCE QUEUE ---
let isWriting = false;
const pendingWrites = [];

const processWriteQueue = async () => {
  if (isWriting || pendingWrites.length === 0) return;
  isWriting = true;
  const { data, resolve, reject } = pendingWrites.shift();
  try {
    let projects = (await fs.pathExists(PROJECTS_FILE)) ? await fs.readJson(PROJECTS_FILE) : [];
    projects.push({ id: Date.now(), ...data });
    await fs.writeJson(PROJECTS_FILE, projects, { spaces: 2 });
    resolve(projects[projects.length - 1]);
  } catch (err) {
    reject(err);
  } finally {
    isWriting = false;
    processWriteQueue();
  }
};

app.post('/api/projects', (req, res) => {
  new Promise((resolve, reject) => {
    pendingWrites.push({ data: req.body, resolve, reject });
    processWriteQueue();
  })
  .then(project => res.json(project))
  .catch(err => res.status(500).send(err));
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = (await fs.pathExists(PROJECTS_FILE)) ? await fs.readJson(PROJECTS_FILE) : [];
    res.json(projects);
  } catch (err) { res.status(500).send(err); }
});

app.listen(PORT, '0.0.0.0', () => console.log(`SYSTEM: active on port ${PORT}`));
