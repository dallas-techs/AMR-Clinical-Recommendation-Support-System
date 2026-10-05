from pydantic import BaseModel
from typing import Optional


class DoctorVerificationCreate(BaseModel):
    patient_id: int
    verification_status: str = "Verified"
    doctor_notes: Optional[str] = None


class DoctorVerificationResponse(BaseModel):
    id: int
    patient_id: int
    prediction_id: int
    doctor_id: int
    doctor_name: str
    verification_status: str
    doctor_notes: Optional[str]
    verified_at: object

    class Config:
        from_attributes = True