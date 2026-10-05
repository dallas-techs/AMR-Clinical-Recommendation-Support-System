from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class DashboardActivity(BaseModel):
    activity: str
    patient_id: int
    patient_name: str
    created_at: datetime


class TopRiskPatient(BaseModel):
    patient_id: int
    patient_name: str
    patient_code: str
    risk_score: float
    risk_level: str
    prediction: str
    predicted_at: datetime


class ModelPerformance(BaseModel):
    model_name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float


class DashboardResponse(BaseModel):

    total_patients: int

    clinical_records: int

    total_predictions: int

    verified_reports: int

    high_risk_cases: int

    low_risk_cases: int

    average_risk_score: float

    recent_activity: List[DashboardActivity]

    top_risk_patients: List[TopRiskPatient] = []

    model_performance: Optional[ModelPerformance] = None

    pending_verifications: int = 0