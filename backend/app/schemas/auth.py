from pydantic import BaseModel, Field


class UserRegister(BaseModel):

    doctor_id: int = Field(
        ...,
        ge=1000,
        le=9999
    )

    doctor_name: str

    password: str


class UserLogin(BaseModel):

    doctor_id: int

    password: str


class Token(BaseModel):

    access_token: str

    token_type: str


class TokenData(BaseModel):

    doctor_id: int | None = None