
import { jsPDF } from 'jspdf';
import fs from 'fs';

// Helper function to add wrapped text
function addWrappedText(doc, text, options) {
    const { x, y, maxWidth, lineHeight, style, fontSize } = options;
    doc.setFontSize(fontSize);
    doc.setFont(undefined, style || 'normal');
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y, { lineHeightFactor: lineHeight });
    return lines.length * (fontSize * lineHeight / 2); // Return the height of the text block
}

async function createPdf() {
    const markdownContent = fs.readFileSync('MISSION/EXECUTIVE_SUMMARY.md', 'utf8');

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4'
    });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    const maxWidth = pageW - (margin * 2);
    let currentY = margin;

    // Set background
    doc.setFillColor('#0A0A0A');
    doc.rect(0, 0, pageW, pageH, 'F');
    
    // Default text color
    doc.setTextColor('#E5E5E5');

    const lines = markdownContent.split('\n');

    for (const line of lines) {
        if (currentY > pageH - margin) {
            doc.addPage();
            currentY = margin;
            // Set background for new page
            doc.setFillColor('#0A0A0A');
            doc.rect(0, 0, pageW, pageH, 'F');
            doc.setTextColor('#E5E5E5');
        }

        if (line.startsWith('<h1>')) { // Custom handling for placeholder
             // Skip
        } else if (line.startsWith('<h3>')) {
            const text = line.replace(/<\/?h3>/g, '');
            doc.setFontSize(14);
            doc.setTextColor('#999999');
            currentY += 10;
            currentY += addWrappedText(doc, text, { x: margin, y: currentY, maxWidth, lineHeight: 1.5, fontSize: 14, style: 'italic' });
            currentY += 20;
        } else if (line.startsWith('## ')) {
            const text = line.substring(3);
            doc.setFontSize(22);
            doc.setFont(undefined, 'bold');
            doc.setTextColor('#FFFFFF');
            currentY += 25;
            doc.line(margin, currentY, pageW - margin, currentY); // Divider line
            currentY += 15;
            currentY += addWrappedText(doc, text, { x: margin, y: currentY, maxWidth, lineHeight: 1.4, fontSize: 22, style: 'bold' });
             currentY += 10;

        } else if (line.startsWith('- ')) {
            const text = line.substring(2);
             doc.setFontSize(12);
             doc.setTextColor('#A5F3FC');
             doc.text('•', margin, currentY);
             currentY += addWrappedText(doc, text, { x: margin + 15, y: currentY, maxWidth: maxWidth - 15, lineHeight: 1.6, fontSize: 12 });
             currentY += 5;
        } else if (line.trim() === '---') {
            currentY += 15;
            doc.setDrawColor('#333333');
            doc.line(margin, currentY, pageW - margin, currentY);
            currentY += 15;
        } else if (line.trim().length > 0) {
            currentY += addWrappedText(doc, line, { x: margin, y: currentY, maxWidth, lineHeight: 1.6, fontSize: 12 });
            currentY += 10;
        }
    }


    // Save the PDF
    doc.save('MISSION/ParadigmOS_Sovereign_Dossier.pdf');
    console.log('PDF generated successfully.');
}

// Special handling for h1 from the HTML file, since MD file doesn't have it
async function createPdfWithTitle() {
    const markdownContent = fs.readFileSync('MISSION/EXECUTIVE_SUMMARY.md', 'utf8');

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4'
    });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 40;
    const maxWidth = pageW - (margin * 2);
    let currentY = margin;

    // Set background
    doc.setFillColor('#0A0A0A');
    doc.rect(0, 0, pageW, pageH, 'F');
    
    // Default text color
    doc.setTextColor('#E5E5E5');

    // Manually add titles
    doc.setFontSize(30);
    doc.setFont(undefined, 'bold');
    doc.setTextColor('#FFFFFF');
    doc.text('ParadigmOS: The Sovereign Dossier', pageW / 2, currentY, { align: 'center' });
    currentY += 35;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.setTextColor('#999999');
    doc.text('A Blueprint for the Future of Professional Authority', pageW / 2, currentY, { align: 'center' });
    currentY += 20;

    doc.setDrawColor('#333333');
    doc.line(margin, currentY, pageW - margin, currentY);
    currentY += 20;


    const lines = markdownContent.split('\n').slice(3); // Skip MD headers

    for (const line of lines) {
        if (currentY > pageH - margin) {
            doc.addPage();
            currentY = margin;
            doc.setFillColor('#0A0A0A');
            doc.rect(0, 0, pageW, pageH, 'F');
            doc.setTextColor('#E5E5E5');
        }

        if (line.startsWith('## ')) {
            const text = line.substring(3);
            doc.setFontSize(20);
            doc.setFont(undefined, 'bold');
            doc.setTextColor('#FFFFFF');
            currentY += 25;
            currentY += addWrappedText(doc, text, { x: margin, y: currentY, maxWidth, lineHeight: 1.4, fontSize: 20, style: 'bold' });
             currentY += 15;
        } else if (line.startsWith('- ')) {
             const text = line.substring(2).replace(/<\/?(strong|em)>/g, '');
             doc.setFontSize(12);
             doc.setTextColor('#A5F3FC');
             doc.text('•', margin, currentY);
             doc.setTextColor('#E5E5E5');
             currentY += addWrappedText(doc, text, { x: margin + 15, y: currentY, maxWidth: maxWidth - 15, lineHeight: 1.6, fontSize: 12 });
             currentY += 8;
        } else if (line.trim() === '---') {
            currentY += 15;
            doc.setDrawColor('#333333');
            doc.line(margin, currentY, pageW - margin, currentY);
            currentY += 15;
        } else if (line.trim().length > 0) {
            const cleanLine = line.replace(/<\/?(strong|em)>/g, '');
            currentY += addWrappedText(doc, cleanLine, { x: margin, y: currentY, maxWidth, lineHeight: 1.6, fontSize: 12 });
            currentY += 12;
        }
    }

    doc.save('MISSION/ParadigmOS_Sovereign_Dossier.pdf');
    console.log('PDF generated successfully at MISSION/ParadigmOS_Sovereign_Dossier.pdf');
}


createPdfWithTitle().catch(console.error);
