from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db

from app.schemas.prediction import (
    PredictionCreate,
    PredictionResponse,
    PredictionHistoryResponse
)

from app.services.prediction_service import (
    predict_amr,
    get_prediction_history
)

router = APIRouter()


# ============================================================
# CREATE AMR PREDICTION
# ============================================================

@router.post(
    "/",
    response_model=PredictionResponse
)
def make_prediction(
    data: PredictionCreate,
    db: Session = Depends(get_db)
):
    return predict_amr(db, data)


# ============================================================
# GET PREDICTION HISTORY (with pagination & filters)
# ============================================================

@router.get(
    "/history",
    response_model=list[PredictionHistoryResponse]
)
def prediction_history(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0, description="Records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Records to return"),
    risk_level: Optional[str] = Query(None, description="Filter: High or Low"),
    patient_id: Optional[int] = Query(None, description="Filter by patient ID"),
):
    return get_prediction_history(
        db,
        skip=skip,
        limit=limit,
        risk_level=risk_level,
        patient_id=patient_id
    )