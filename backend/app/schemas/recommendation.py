from pydantic import BaseModel
from typing import List


class RecommendationRequest(BaseModel):
    patient_id: int
    prediction: str


class RecommendationResponse(BaseModel):
    patient_id: int
    prediction: str
    recommendations: List[str]