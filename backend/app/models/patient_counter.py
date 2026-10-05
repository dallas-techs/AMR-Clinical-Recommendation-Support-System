from sqlalchemy import Column, Integer

from app.database import Base


class PatientCounter(Base):
    __tablename__ = "patient_counter"

    id = Column(Integer, primary_key=True)
    last_number = Column(Integer, nullable=False, default=0)