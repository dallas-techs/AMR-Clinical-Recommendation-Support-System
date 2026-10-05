from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import UserRegister, UserLogin, Token
from app.services.auth_service import (
    create_user,
    authenticate_user,
    get_user_by_doctor_id
)
from app.utils.security import create_access_token


router = APIRouter()


# =========================================================
# REGISTER DOCTOR
# =========================================================

@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    # Check whether Doctor ID already exists
    existing_user = get_user_by_doctor_id(
        db,
        user.doctor_id
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Doctor ID already registered"
        )


    # Create new doctor
    new_user = create_user(
        db=db,
        doctor_id=user.doctor_id,
        doctor_name=user.doctor_name,
        password=user.password
    )


    return {
        "message": "Doctor registered successfully",
        "doctor_id": new_user.doctor_id,
        "doctor_name": new_user.doctor_name
    }


# =========================================================
# LOGIN DOCTOR
# =========================================================

@router.post("/login", response_model=Token)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    authenticated_user = authenticate_user(
        db,
        user.doctor_id,
        user.password
    )


    if not authenticated_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Doctor ID or password"
        )


    # Create JWT token
    access_token = create_access_token(
        data={
            "sub": str(authenticated_user.doctor_id),
            "doctor_name": authenticated_user.doctor_name,
            "role": authenticated_user.role
        }
    )


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }