from pydantic import BaseModel
from typing import Optional


# ==========================================
# CREATE CLINICAL RECORD
# ==========================================

class ClinicalRecordCreate(BaseModel):
    patient_id: int
    diagnosis: str

    admission_type: str
    length_of_stay: float

    # Raw data required for feature engineering
    diagnoses: str
    drugs: str
    org_name: str
    antibiotic_results: str

    # Laboratory values
    creatinine: float
    glucose: float
    hemoglobin: float
    white_blood_cells: float
    platelet_count: float
    potassium: float
    sodium: float
    urea_nitrogen: float


# ==========================================
# UPDATE CLINICAL RECORD
# ==========================================

class ClinicalRecordUpdate(BaseModel):
    diagnosis: Optional[str] = None

    admission_type: Optional[str] = None
    length_of_stay: Optional[float] = None

    # Raw feature-engineering data
    diagnoses: Optional[str] = None
    drugs: Optional[str] = None
    org_name: Optional[str] = None
    antibiotic_results: Optional[str] = None

    # Laboratory values
    creatinine: Optional[float] = None
    glucose: Optional[float] = None
    hemoglobin: Optional[float] = None
    white_blood_cells: Optional[float] = None
    platelet_count: Optional[float] = None
    potassium: Optional[float] = None
    sodium: Optional[float] = None
    urea_nitrogen: Optional[float] = None


# ==========================================
# RESPONSE
# ==========================================

class ClinicalRecordResponse(BaseModel):
    id: int
    patient_id: int
    diagnosis: str

    admission_type: Optional[str] = None
    length_of_stay: Optional[float] = None

    # Raw clinical / microbiology data
    diagnoses: Optional[str] = None
    drugs: Optional[str] = None
    org_name: Optional[str] = None
    antibiotic_results: Optional[str] = None

    creatinine: float
    glucose: float
    hemoglobin: float
    white_blood_cells: float
    platelet_count: float
    potassium: float
    sodium: float
    urea_nitrogen: float

    class Config:
        from_attributes = True