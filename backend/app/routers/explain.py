from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.explain import ExplainRequest, ExplainResponse
from app.services.explain_service import explain_prediction


router = APIRouter()


@router.post("/", response_model=ExplainResponse)
def explain(
    data: ExplainRequest,
    db: Session = Depends(get_db)
):

    try:
        return explain_prediction(db, data)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )