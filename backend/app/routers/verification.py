from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.patient import Patient
from app.models.prediction import Prediction
from app.models.recommendation import Recommendation


router = APIRouter()


@router.get("/verify/{patient_id}")
def verify_report(patient_id: int, db: Session = Depends(get_db)):

    patient = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient report not found"
        )

    prediction = (
        db.query(Prediction)
        .filter(Prediction.patient_id == patient_id)
        .order_by(Prediction.id.desc())
        .first()
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    recommendation = (
        db.query(Recommendation)
        .filter(
            Recommendation.prediction_id == prediction.id
        )
        .order_by(Recommendation.id.desc())
        .first()
    )

    return {
        "status": "verified",
        "message": "AMR Clinical Report verified successfully",
        "patient": {
            "patient_id": patient.patient_id,
            "name": patient.full_name,
            "age": patient.age,
            "gender": patient.gender
        },
        "prediction": {
            "result": prediction.prediction,
            "risk_score": prediction.risk_score,
            "confidence": prediction.confidence,
            "model_version": prediction.model_version,
            "prediction_id": prediction.id
        },
        "recommendation_available": recommendation is not None
    }