from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.security import hash_password, verify_password


def get_user_by_doctor_id(
    db: Session,
    doctor_id: int
):
    return db.query(User).filter(
        User.doctor_id == doctor_id
    ).first()


def create_user(
    db: Session,
    doctor_id: int,
    doctor_name: str,
    password: str
):
    hashed_password = hash_password(password)

    user = User(
        doctor_id=doctor_id,
        doctor_name=doctor_name,
        password_hash=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    doctor_id: int,
    password: str
):
    user = get_user_by_doctor_id(
        db,
        doctor_id
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None

    return user