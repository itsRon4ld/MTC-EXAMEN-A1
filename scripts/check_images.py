import pdfplumber

pdf_path = r'C:\Users\RONALD\Downloads\Balotario de preguntas para examen de clase A, categoría I.pdf'
with pdfplumber.open(pdf_path) as pdf:
    for p_idx in [0, 1, 2, 3, 9, 10, 15, 18, 19, 20]:
        page = pdf.pages[p_idx]
        imgs = page.images
        print(f"=== Page {p_idx+1} ({len(imgs)} images) ===")
        for i, img in enumerate(imgs):
            # Ignore banner header logo if on page 1
            top = img.get('top', 0)
            bottom = img.get('bottom', 0)
            x0 = img.get('x0', 0)
            width = img.get('width', 0)
            height = img.get('height', 0)
            print(f"  Img {i}: top={top:.1f}, bottom={bottom:.1f}, x0={x0:.1f}, w={width:.1f}, h={height:.1f}")
