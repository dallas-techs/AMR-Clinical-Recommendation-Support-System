from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.clinical_record import (
    ClinicalRecordCreate,
    ClinicalRecordUpdate,
    ClinicalRecordResponse,
)
from app.services.clinical_record_service import (
    create_clinical_record,
    get_all_clinical_records,
    get_clinical_record_by_id,
    update_clinical_record,
    delete_clinical_record,
)

router = APIRouter()


# Create Clinical Record
@router.post("/", response_model=ClinicalRecordResponse)
def add_clinical_record(
    record: ClinicalRecordCreate,
    db: Session = Depends(get_db)
):
    return create_clinical_record(db, record)


# Get All Clinical Records
@router.get("/", response_model=List[ClinicalRecordResponse])
def view_all_clinical_records(db: Session = Depends(get_db)):
    return get_all_clinical_records(db)

# Get Latest Clinical Record By Patient ID
@router.get("/patient/{patient_id}", response_model=ClinicalRecordResponse)
def view_patient_clinical_record(
    patient_id: int,
    db: Session = Depends(get_db)
):
    records = get_all_clinical_records(db)

    patient_records = [
        record for record in records
        if record.patient_id == patient_id
    ]

    if not patient_records:
        raise HTTPException(
            status_code=404,
            detail="Clinical record not found for this patient"
        )

    return patient_records[-1]

# Get Clinical Record By ID
@router.get("/{record_id}", response_model=ClinicalRecordResponse)
def view_clinical_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    record = get_clinical_record_by_id(db, record_id)

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Clinical record not found"
        )

    return record


# Update Clinical Record
@router.put("/{record_id}", response_model=ClinicalRecordResponse)
def edit_clinical_record(
    record_id: int,
    record: ClinicalRecordUpdate,
    db: Session = Depends(get_db)
):
    updated = update_clinical_record(db, record_id, record)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Clinical record not found"
        )

    return updated


# Delete Clinical Record
@router.delete("/{record_id}")
def remove_clinical_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_clinical_record(db, record_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Clinical record not found"
        )

    return {
        "message": "Clinical record deleted successfully"
    }