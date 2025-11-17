from pydantic import BaseModel, field_validator, EmailStr
from auth_service.errors.errors import *


class ClientUpdateRequest(BaseModel):
    email: EmailStr | None = None
    company: str | None = None
    TIN: str | None = None
    phone_number: str | None = None
    partner_id: int | None = None
    JWT: str

    @field_validator('*')
    def not_empty(cls, field: str | int | EmailStr) -> str | int:
        if isinstance(field, str) and not field.strip():
            raise ValueError('The field must not be empty')
        return field
    
    # TODO: вынести кол. символов в конфигарию
    @field_validator('TIN')
    def validate_tin(cls, TIN: str) -> str:
        if len(TIN) != 12:
            raise TINValidateError(detail='The length of the tin field must be 12')
        return TIN
    
    # TODO: вынести кол. символов в конфигарию, 
    @field_validator('phone_number')
    def phone_number_validator(cls, phone_number: str) -> str:
        if len(phone_number) < 5:
            raise PhoneNumberValidateError(detail='The length of the pnone_number field must be at least 5')
        if not all(digit.isnumeric() for digit in phone_number):
            raise PhoneNumberValidateError(detail='The phone_number must coontains only digits')
        return phone_number
    
    @field_validator('JWT')
    def validate_jwt(cls, value: str):
        parts = value.split('.')
        if len(parts) != 3:
            raise ValueError('Invalid JWT token format')
        return value
