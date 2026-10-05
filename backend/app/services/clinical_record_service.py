from sqlalchemy.orm import Session

from app.models.clinical_record import ClinicalRecord
from app.schemas.clinical_record import (
    ClinicalRecordCreate,
    ClinicalRecordUpdate
)


def create_clinical_record(db: Session, record: ClinicalRecordCreate):
    db_record = ClinicalRecord(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_all_clinical_records(db: Session):
    return (
        db.query(ClinicalRecord)
        .order_by(ClinicalRecord.id.asc())
        .all()
    )


def get_clinical_record_by_id(db: Session, record_id: int):
    return db.query(ClinicalRecord).filter(
        ClinicalRecord.id == record_id
    ).first()


def update_clinical_record(
    db: Session,
    record_id: int,
    record_data: ClinicalRecordUpdate
):
    record = db.query(ClinicalRecord).filter(
        ClinicalRecord.id == record_id
    ).first()

    if not record:
        return None

    update_data = record_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record


def delete_clinical_record(db: Session, record_id: int):
    record = db.query(ClinicalRecord).filter(
        ClinicalRecord.id == record_id
    ).first()

    if not record:
        return None

    db.delete(record)
    db.commit()

    return record