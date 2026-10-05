from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class ClinicalRecord(Base):
    __tablename__ = "clinical_records"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id = Column(
        Integer,
        ForeignKey("patients.id")
    )

    diagnosis = Column(
        String(255)
    )

    admission_type = Column(
        String(100)
    )

    length_of_stay = Column(
        Float
    )

    # ==========================================
    # RAW DATA FOR FEATURE ENGINEERING
    # ==========================================

    diagnoses = Column(
        String(1000),
        nullable=True
    )

    drugs = Column(
        String(1000),
        nullable=True
    )

    org_name = Column(
        String(1000),
        nullable=True
    )
    antibiotic_results = Column(
    String(5000),
    nullable=True
    )

    # ==========================================
    # LAB VALUES
    # ==========================================

    creatinine = Column(
        Float
    )

    glucose = Column(
        Float
    )

    hemoglobin = Column(
        Float
    )

    white_blood_cells = Column(
        Float
    )

    platelet_count = Column(
        Float
    )

    potassium = Column(
        Float
    )

    sodium = Column(
        Float
    )

    urea_nitrogen = Column(
        Float
    )

    clinical_notes = Column(
        String(500)
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    patient = relationship(
        "Patient"
    )