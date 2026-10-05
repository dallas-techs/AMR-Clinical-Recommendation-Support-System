from pydantic import BaseModel
from typing import List


class ExplainRequest(BaseModel):
    patient_id: int

    admission_type: int
    length_of_stay: float
    gender: int
    age: int

    Creatinine: float
    Glucose: float
    Hemoglobin: float
    Platelet_Count: float
    Potassium: float
    Sodium: float
    Urea_Nitrogen: float
    White_Blood_Cells: float


class FeatureContribution(BaseModel):
    feature: str
    contribution: float


class ExplainResponse(BaseModel):
    prediction: str
    top_features: List[FeatureContribution]