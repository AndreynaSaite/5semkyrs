# from pydantic import BaseModel, field_validator, EmailStr
# from auth_service.utils.password_utils import PasswordUtils
# from auth_service.errors.errors import *
#
#
# class ClientRegister(BaseModel):
#     email: EmailStr
#     password: str
#     tin: int # TIN (Tax Identification Number) - идентификационный номер налогоплательщика (ИНН)
#     phone_number: int
#
#     @field_validator('*')
#     def not_empty(cls, field: str | int | EmailStr) -> str | int:
#         if isinstance(field, str) and not field.strip():
#             raise ValueError('The field must not be empty')
#         return field
#
#     @field_validator('password')
#     def validate_password(cls, password: str) -> str:
#         status, error = PasswordUtils.is_password_valid(password)
#         if not status:
#             raise PasswordValidateError(detail=error)
#         return password
#
#     @field_validator('phone_number')
#     def phone_number_validator(cls, phone_number: int) -> int:
#         if len(str(phone_number)) < 5:
#             raise PhoneNumberValidateError(detail='The length of the pnone_number field must be at least 5')
#         return phone_number
