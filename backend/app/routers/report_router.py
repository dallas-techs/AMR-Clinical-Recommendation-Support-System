from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.report_service import generate_report

router = APIRouter()


@router.get("/generate/{patient_id}")
def generate_patient_report(
    patient_id: int,
    db: Session = Depends(get_db)
):

    pdf_file = generate_report(db, patient_id)

    return FileResponse(
        path=pdf_file,
        media_type="application/pdf",
        filename=pdf_file
    )