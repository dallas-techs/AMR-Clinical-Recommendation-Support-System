from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class DoctorVerification(Base):
    __tablename__ = "doctor_verifications"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    prediction_id = Column(
        Integer,
        ForeignKey("predictions.id"),
        nullable=False
    )

    doctor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    doctor_name = Column(
        String(100),
        nullable=False
    )

    verification_status = Column(
        String(30),
        nullable=False,
        default="Verified"
    )

    doctor_notes = Column(
        Text,
        nullable=True
    )

    verified_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    patient = relationship("Patient")

    prediction = relationship("Prediction")

    doctor = relationship("User")