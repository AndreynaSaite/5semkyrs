from pydantic import BaseModel, field_validator, EmailStr
from auth_service.errors.errors import *


class ClientDeleteRequest(BaseModel):
    JWT: str

    @field_validator('*')
    def not_empty(cls, field: str | EmailStr) -> str:
        if isinstance(field, str) and not field.strip():
            raise ValueError('The field must not be empty')
        return field

    @field_validator('JWT')
    def validate_jwt(cls, value: str):
        parts = value.split('.')
        if len(parts) != 3:
            raise ValueError('Invalid JWT token format')
        return value
