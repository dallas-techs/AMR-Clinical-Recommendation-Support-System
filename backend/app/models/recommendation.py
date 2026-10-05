from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)

    prediction_id = Column(Integer, ForeignKey("predictions.id"))

    recommended_antibiotic = Column(String(255))

    reason = Column(String(500))

    doctor_notes = Column(String(500))

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    prediction = relationship("Prediction")