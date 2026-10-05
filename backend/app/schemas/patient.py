from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


class PatientCreate(BaseModel):
    full_name: str
    age: int
    gender: str
    blood_group: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: EmailStr


class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None


class PatientResponse(BaseModel):
    id: int
    patient_id: str
    full_name: str
    age: int
    gender: str
    blood_group: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: EmailStr

    class Config:
        from_attributes = True