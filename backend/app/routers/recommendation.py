from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.prediction import Prediction

from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse
)

from app.services.recommendation_service import (
    get_recommendations
)


router = APIRouter()


@router.post("/", response_model=RecommendationResponse)
def recommend(
    data: RecommendationRequest,
    db: Session = Depends(get_db)
):

    # Find the latest prediction for this patient
    prediction = (
        db.query(Prediction)
        .filter(Prediction.patient_id == data.patient_id)
        .order_by(Prediction.id.desc())
        .first()
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found for this patient"
        )

    # Generate and save recommendation
    return get_recommendations(
        db,
        data,
        prediction.id
    )