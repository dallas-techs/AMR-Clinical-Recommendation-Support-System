from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient
from app.models.prediction import Prediction
from app.models.doctor_verification import DoctorVerification
from app.schemas.doctor_verification import (
    DoctorVerificationCreate,
    DoctorVerificationResponse
)
from app.utils.dependencies import get_current_user


router = APIRouter()


# ============================================================
# DOCTOR VERIFICATION
# ============================================================

@router.post(
    "/verify",
    response_model=DoctorVerificationResponse
)
def verify_patient_report(
    data: DoctorVerificationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # --------------------------------------------------------
    # 1. Check logged-in user is a doctor
    # --------------------------------------------------------

    if current_user.role != "doctor":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can verify clinical reports"
        )

    # --------------------------------------------------------
    # 2. Check patient exists
    # --------------------------------------------------------

    patient = (
        db.query(Patient)
        .filter(Patient.id == data.patient_id)
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # --------------------------------------------------------
    # 3. Get latest prediction
    # --------------------------------------------------------

    prediction = (
        db.query(Prediction)
        .filter(
            Prediction.patient_id == data.patient_id
        )
        .order_by(Prediction.id.desc())
        .first()
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="No prediction found for this patient"
        )

    # --------------------------------------------------------
    # 4. Check whether latest prediction was already verified
    # --------------------------------------------------------

    existing_verification = (
        db.query(DoctorVerification)
        .filter(
            DoctorVerification.patient_id == data.patient_id,
            DoctorVerification.prediction_id == prediction.id
        )
        .first()
    )

    if existing_verification is not None:
        raise HTTPException(
            status_code=400,
            detail="This prediction has already been verified"
        )

    # --------------------------------------------------------
    # 5. Create doctor verification
    # --------------------------------------------------------

    verification = DoctorVerification(
        patient_id=data.patient_id,
        prediction_id=prediction.id,
        doctor_id=current_user.id,
        doctor_name=current_user.doctor_name,
        verification_status=data.verification_status,
        doctor_notes=data.doctor_notes
    )

    # --------------------------------------------------------
    # 6. Save to database
    # --------------------------------------------------------

    db.add(verification)
    db.commit()
    db.refresh(verification)

    return verification


# ============================================================
# GET EXISTING DOCTOR VERIFICATION
# ============================================================

@router.get(
    "/patient/{patient_id}",
    response_model=DoctorVerificationResponse
)
def get_patient_verification(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # --------------------------------------------------------
    # 1. Check logged-in user is a doctor
    # --------------------------------------------------------

    if current_user.role != "doctor":
        raise HTTPException(
            status_code=403,
            detail="Only doctors can view clinical report verification"
        )

    # --------------------------------------------------------
    # 2. Check patient exists
    # --------------------------------------------------------

    patient = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    # --------------------------------------------------------
    # 3. Get latest prediction
    # --------------------------------------------------------

    prediction = (
        db.query(Prediction)
        .filter(
            Prediction.patient_id == patient_id
        )
        .order_by(Prediction.id.desc())
        .first()
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="No prediction found for this patient"
        )

    # --------------------------------------------------------
    # 4. Get verification for latest prediction
    # --------------------------------------------------------

    verification = (
        db.query(DoctorVerification)
        .filter(
            DoctorVerification.patient_id == patient_id,
            DoctorVerification.prediction_id == prediction.id
        )
        .order_by(DoctorVerification.id.desc())
        .first()
    )

    if verification is None:
        raise HTTPException(
            status_code=404,
            detail="No verification found for this prediction"
        )

    # --------------------------------------------------------
    # 5. Return existing verification
    # --------------------------------------------------------

    return verification