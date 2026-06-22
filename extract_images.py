import fitz
import os

pdf_path = "/Users/anthonycyber/Developer/StellarTicket/public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics/PORTFOLIO Razer_Blade_Stealth_Full_Troubleshooting_Log.pdf"
out_dir = "/Users/anthonycyber/Developer/StellarTicket/public/assets/dossier/documentation/razer-battery-replacement-VRM-diagnostics"

doc = fitz.open(pdf_path)
for page_index in range(len(doc)):
    page = doc[page_index]
    image_list = page.get_images()
    
    for image_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        image_name = f"page_{page_index+1}_image_{image_index}.{image_ext}"
        image_path = os.path.join(out_dir, image_name)
        
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        print(f"Saved {image_name}")

