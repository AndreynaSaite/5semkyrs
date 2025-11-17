class AuthServiceError(Exception):
    def __init__(self, detail: str) -> None:
        super().__init__()
        self.name = self.__class__.__name__
        self.detail: str = detail


class InvalidTokenError(AuthServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class ExpiredTokenError(AuthServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class PasswordValidateError(AuthServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class TINValidateError(AuthServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class PhoneNumberValidateError(AuthServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class EmailValidateError(AuthServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class IncorrcetEmailOrPasswordError(AuthServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class DbError(AuthServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class DataTypeError(DbError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class DataValueError(DbError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class DbOperationError(DbError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)
