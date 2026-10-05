from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.report import ReportRequest
from app.services.report_service import generate_report

router = APIRouter()


@router.post("/")
def create_report(
    data: ReportRequest,
    db: Session = Depends(get_db)
):
    return generate_report(
        db,
        data.patient_id
    )