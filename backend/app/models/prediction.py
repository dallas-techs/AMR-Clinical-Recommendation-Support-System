from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(Integer, ForeignKey("patients.id"))

    risk_score = Column(Float)

    prediction = Column(String(50))

    risk_level = Column(String(20))

    confidence = Column(Float)

    model_version = Column(String(50))

    # Store the exact feature values used for this prediction
    input_features = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("Patient")