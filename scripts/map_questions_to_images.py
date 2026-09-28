import pdfplumber

pdf_path = r'C:\Users\RONALD\Downloads\Balotario de preguntas para examen de clase A, categoría I.pdf'

with pdfplumber.open(pdf_path) as pdf:
    for p_idx, page in enumerate(pdf.pages):
        table = page.find_tables()
        if not table:
            continue
        t = table[0]
        rows = t.rows
        imgs = [img for img in page.images if not (p_idx == 0 and img.get('top', 0) < 100)] # skip header logo on page 1
        
        # Match each image to a row
        print(f"--- Page {p_idx+1}: {len(rows)-1} question rows, {len(imgs)} images ---")
        for r_idx, row in enumerate(rows):
            # row.bbox is (x0, top, x1, bottom)
            cell_text = row.cells[0] # cell for question number
            q_num_text = page.crop(cell_text).extract_text() if cell_text else ""
            clean_num = ''.join(c for c in q_num_text if c.isdigit())
            if not clean_num:
                continue
            q_id = int(clean_num)
            
            # Check if any image falls in this row bbox
            r_top = row.bbox[1]
            r_bottom = row.bbox[3]
            matched_imgs = [i for i, img in enumerate(imgs) if r_top - 5 <= img.get('top', 0) <= r_bottom + 5]
            
            if matched_imgs:
                print(f"  Q{q_id} (row {r_idx}) at y=[{r_top:.1f}, {r_bottom:.1f}] has image(s): {matched_imgs}")
