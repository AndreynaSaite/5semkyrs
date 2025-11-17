from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from auth_service.errors.errors import *
from fastapi import FastAPI, Request


def auth_service_error_handler(request: Request, exc: InvalidTokenError) -> JSONResponse:
    return JSONResponse(status_code=400, content={'status': 'error', 'error': exc.name, 'message': exc.detail})


def request_validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(status_code=400, content={'status': 'error', 'error': 'RequestValidationError', 'message': exc.errors()[0].get('msg')})


def bind_error_handlers(app: FastAPI) -> None:
    app.exception_handlers = {
        AuthServiceError: auth_service_error_handler,
        DbError: auth_service_error_handler,
        DataTypeError: auth_service_error_handler,
        DataValueError: auth_service_error_handler,
        DbOperationError: auth_service_error_handler,
        InvalidTokenError: auth_service_error_handler,
        ExpiredTokenError: auth_service_error_handler,
        PasswordValidateError: auth_service_error_handler,
        TINValidateError: auth_service_error_handler,
        PhoneNumberValidateError: auth_service_error_handler,
        RequestValidationError: request_validation_error_handler,
        IncorrcetEmailOrPasswordError: auth_service_error_handler
    }
