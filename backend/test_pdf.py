from app.services.pdf_template import build_test_pdf

filename = build_test_pdf()

print(f"PDF Created: {filename}")