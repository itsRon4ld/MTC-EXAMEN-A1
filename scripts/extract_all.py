import pdfplumber
import pypdf
import os
import json
import re

pdf_path = r'C:\Users\RONALD\Downloads\Balotario de preguntas para examen de clase A, categoría I.pdf'
signs_dir = r'C:\Users\RONALD\Documents\Personal\public\signs'
data_dir = r'C:\Users\RONALD\Documents\Personal\src\core\training-quiz\server\data'

os.makedirs(signs_dir, exist_ok=True)
os.makedirs(data_dir, exist_ok=True)

def clean_text(t):
    if not t:
        return ""
    t = re.sub(r'[\r\n]+', ' ', t)
    t = re.sub(r'\s+', ' ', t)
    return t.strip()

def extract_code(prompt):
    match = re.search(r'\b([RPI]-\d+[-a-zA-Z0-9]*)\b', prompt)
    if match:
        return match.group(1)
    if 'SOAT' in prompt:
        return 'SOAT'
    if 'velocidad' in prompt.lower():
        return 'VEL.'
    if 'preferencia' in prompt.lower() or 'prioridad' in prompt.lower():
        return 'PRIO.'
    if 'infracción' in prompt.lower() or 'infraccion' in prompt.lower() or 'sanción' in prompt.lower() or 'sancion' in prompt.lower():
        return 'INFR.'
    return None

def determine_category(prompt, code):
    if code and code.startswith('R-'):
        return 'Señales Reglamentarias'
    if code and code.startswith('P-'):
        return 'Señales Preventivas'
    if code and code.startswith('I-'):
        return 'Señales Informativas'
    p_lower = prompt.lower()
    if 'velocidad' in p_lower or 'luces' in p_lower or 'luz' in p_lower or 'neblina' in p_lower:
        return 'Velocidades y Luces'
    if 'preferencia' in p_lower or 'prioridad' in p_lower or 'intersección' in p_lower or 'interseccion' in p_lower or 'rotonda' in p_lower or 'carril' in p_lower:
        return 'Reglas de Tránsito y Prioridades'
    if 'infracción' in p_lower or 'infraccion' in p_lower or 'sanción' in p_lower or 'sancion' in p_lower or 'multa' in p_lower or 'alcohol' in p_lower or 'puntos' in p_lower:
        return 'Infracciones y Sanciones'
    if 'soat' in p_lower or 'inspección' in p_lower or 'inspeccion' in p_lower or 'licencia' in p_lower or 'tarjeta' in p_lower or 'seguro' in p_lower:
        return 'Documentos y Aspectos Técnicos'
    return 'Materias Generales'

print("Extracting questions and images...")

questions = []
pypdf_reader = pypdf.PdfReader(pdf_path)

with pdfplumber.open(pdf_path) as pdf:
    for p_idx, page in enumerate(pdf.pages):
        pypdf_page = pypdf_reader.pages[p_idx]
        tables = page.find_tables()
        if not tables:
            continue
        
        t = tables[0]
        data = t.extract()
        rows = t.rows
        
        page_imgs = page.images
        pypdf_imgs = list(pypdf_page.images)
        
        valid_img_indices = []
        for i, img in enumerate(page_imgs):
            if p_idx == 0 and img.get('top', 0) < 100:
                continue
            valid_img_indices.append(i)
            
        for r_idx, row_data in enumerate(data):
            clean_cells = [c.strip() for c in row_data if c is not None and c.strip() != '']
            if not clean_cells:
                continue
            
            first_cell = clean_cells[0]
            clean_num = ''.join(c for c in first_cell if c.isdigit())
            if not clean_num:
                continue
            
            q_id = int(clean_num)
            
            # Match image by vertical overlap
            row_bbox = rows[r_idx].bbox
            r_top = row_bbox[1]
            r_bottom = row_bbox[3]
            
            matched_img_idx = None
            for idx in valid_img_indices:
                img_obj = page_imgs[idx]
                img_top = img_obj.get('top', 0)
                img_bottom = img_obj.get('bottom', 0)
                if (r_top - 5 <= img_top <= r_bottom + 5) or (r_top - 5 <= img_bottom <= r_bottom + 5):
                    matched_img_idx = idx
                    break
            
            media_url = None
            if matched_img_idx is not None and matched_img_idx < len(pypdf_imgs):
                raw_img = pypdf_imgs[matched_img_idx]
                ext = 'png' if 'png' in raw_img.name.lower() else 'jpg'
                filename = f"q{q_id}.{ext}"
                filepath = os.path.join(signs_dir, filename)
                with open(filepath, 'wb') as f:
                    f.write(raw_img.data)
                media_url = f"/signs/{filename}"
            
            prompt = ""
            alt_a = ""
            alt_b = ""
            alt_c = ""
            alt_d = ""
            answer = ""
            
            if len(clean_cells) >= 10:
                prompt = clean_text(clean_cells[4])
                alt_a = clean_text(clean_cells[5])
                alt_b = clean_text(clean_cells[6])
                alt_c = clean_text(clean_cells[7])
                alt_d = clean_text(clean_cells[8])
                answer = clean_cells[9].strip().lower()
            elif len(clean_cells) == 9:
                prompt = clean_text(clean_cells[3])
                alt_a = clean_text(clean_cells[4])
                alt_b = clean_text(clean_cells[5])
                alt_c = clean_text(clean_cells[6])
                alt_d = clean_text(clean_cells[7])
                answer = clean_cells[8].strip().lower()
            else:
                print(f"Warning: Q{q_id} has cell count {len(clean_cells)}: {clean_cells}")
            
            alt_a = re.sub(r'^[aA]\)\s*', '', alt_a)
            alt_b = re.sub(r'^[bB]\)\s*', '', alt_b)
            alt_c = re.sub(r'^[cC]\)\s*', '', alt_c)
            alt_d = re.sub(r'^[dD]\)\s*', '', alt_d)
            
            ans_match = re.search(r'[abcd]', answer)
            if ans_match:
                answer = ans_match.group(0)
            else:
                print(f"Warning: Q{q_id} has invalid answer '{answer}'")
            
            code = extract_code(prompt)
            category = determine_category(prompt, code)
            
            q_data = {
                "id": q_id,
                "code": code,
                "category": category,
                "prompt": prompt,
                "mediaUrl": media_url,
                "options": [
                    { "key": "a", "text": alt_a },
                    { "key": "b", "text": alt_b },
                    { "key": "c", "text": alt_c },
                    { "key": "d", "text": alt_d }
                ],
                "correctAnswer": answer,
                "explanation": f"Respuesta oficial según el Balotario MTC Clase A-I: Alternativa {answer.upper()}."
            }
            questions.append(q_data)

questions.sort(key=lambda q: q["id"])

print(f"\nExtracted total {len(questions)} questions.")
images_extracted = [q for q in questions if q['mediaUrl'] is not None]
print(f"Total questions with images: {len(images_extracted)}")

output_file = os.path.join(data_dir, 'balotario-200.json')
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Saved dataset to {output_file}")
