from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(String(20), unique=True, nullable=False)

    full_name = Column(String(100), nullable=False)

    age = Column(Integer, nullable=False)

    gender = Column(String(10), nullable=False)

    blood_group = Column(String(5))

    phone = Column(String(15))
    
    email = Column(String(100), unique=True, nullable=False)

    address = Column(String(255))

    date_of_birth = Column(Date)

    created_at = Column(DateTime(timezone=True), server_default=func.now())