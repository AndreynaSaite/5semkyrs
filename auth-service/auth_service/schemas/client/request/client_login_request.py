from pydantic import BaseModel, field_validator, EmailStr

from auth_service.errors.errors import PasswordValidateError
from auth_service.utils.password_utils import PasswordUtils


class ClientLoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator('*')
    def not_empty(cls, field: str | EmailStr) -> str:
        if isinstance(field, str) and not field.strip():
            raise ValueError('The field must not be empty')
        return field
    
    @field_validator('password')
    def validate_password(cls, password: str) -> str:
        status, error = PasswordUtils.is_password_valid(password)
        if not status:
            raise PasswordValidateError(detail=error)
        return password