from pydantic import BaseModel
from datetime import datetime

# ============================================================
# PREDICTION REQUEST
# ============================================================

class PredictionCreate(BaseModel):

    # Patient
    patient_id: int

    # Clinical information
    admission_type: int
    length_of_stay: float

    # Patient information
    gender: int
    age: int

    # Laboratory values
    Creatinine: float
    Glucose: float
    Hemoglobin: float
    Platelet_Count: float
    Potassium: float
    Sodium: float
    Urea_Nitrogen: float
    White_Blood_Cells: float


# ============================================================
# PREDICTION RESPONSE
# ============================================================

class PredictionResponse(BaseModel):

    id: int
    patient_id: int

    risk_score: float
    prediction: str
    confidence: float

    model_version: str

    class Config:
        from_attributes = True


# ============================================================
# PREDICTION HISTORY RESPONSE
# ============================================================

class PredictionHistoryResponse(BaseModel):

    id: int
    patient_id: int

    risk_score: float
    prediction: str
    risk_level: str
    confidence: float

    model_version: str
    created_at: datetime

    class Config:
        from_attributes = True