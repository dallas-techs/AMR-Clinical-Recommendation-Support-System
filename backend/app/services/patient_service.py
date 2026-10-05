from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.patient import Patient
from app.models.patient_counter import PatientCounter
from app.schemas.patient import PatientCreate, PatientUpdate


def create_patient(db: Session, patient: PatientCreate):

    # Check duplicate email
    existing_email = db.query(Patient).filter(
        Patient.email == patient.email
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    # Get the patient ID counter
    counter = (
        db.query(PatientCounter)
        .with_for_update()
        .first()
    )

    # If this is the first time using the counter,
    # initialize it from existing patient IDs.
    if not counter:

        last_number = 0

        existing_patients = db.query(
            Patient.patient_id
        ).all()

        for row in existing_patients:

            existing_id = row[0]

            if existing_id and existing_id.startswith("PAT-"):

                try:
                    number = int(
                        existing_id.split("-")[1]
                    )

                    if number > last_number:
                        last_number = number

                except (IndexError, ValueError):
                    continue

        counter = PatientCounter(
            last_number=last_number
        )

        db.add(counter)
        db.flush()

    # Generate the next permanent Patient ID
    counter.last_number += 1

    new_patient_id = (
        f"PAT-{counter.last_number:04d}"
    )

    # Convert request data to dictionary
    patient_data = patient.model_dump()

    # Backend-generated Patient ID
    patient_data["patient_id"] = new_patient_id

    db_patient = Patient(**patient_data)

    db.add(db_patient)

    db.commit()

    db.refresh(db_patient)

    return db_patient


def get_all_patients(db: Session):

    return (
        db.query(Patient)
        .order_by(Patient.id.asc())
        .all()
    )


def get_patient_by_id(
    db: Session,
    patient_id: int
):

    return (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )


def update_patient(
    db: Session,
    patient_id: int,
    patient_data: PatientUpdate
):

    patient = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if not patient:
        return None

    update_data = patient_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(patient, key, value)

    db.commit()

    db.refresh(patient)

    return patient


def delete_patient(
    db: Session,
    patient_id: int
):

    patient = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if not patient:
        return None

    db.delete(patient)

    db.commit()

    return patient