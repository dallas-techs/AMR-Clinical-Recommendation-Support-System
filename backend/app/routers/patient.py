
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas.patient import (
    PatientCreate,
    PatientResponse,
    PatientUpdate
)
from app.services.patient_service import (
    create_patient,
    get_all_patients,
    get_patient_by_id,
    update_patient,
    delete_patient,
)

router = APIRouter()


# Create Patient
@router.post("/", response_model=PatientResponse)
def add_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    return create_patient(db, patient)


# Get All Patients
@router.get("/", response_model=List[PatientResponse])
def view_patients(db: Session = Depends(get_db)):
    return get_all_patients(db)


# Get Patient By ID
@router.get("/{patient_id}", response_model=PatientResponse)
def view_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = get_patient_by_id(db, patient_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


# Update Patient
@router.put("/{patient_id}", response_model=PatientResponse)
def edit_patient(
    patient_id: int,
    patient: PatientUpdate,
    db: Session = Depends(get_db)
):
    updated_patient = update_patient(
        db,
        patient_id,
        patient
    )

    if not updated_patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return updated_patient


# Delete Patient
@router.delete("/{patient_id}")
def remove_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    try:
        patient = delete_patient(db, patient_id)

        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )

        return {
            "message": "Patient deleted successfully"
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=409,
            detail=str(exc)
        ) from exc
