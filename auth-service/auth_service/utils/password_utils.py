from passlib.context import CryptContext
import re


MIN_PASSWORD_LENGTH = 8
#ONE_DIGIT_REGEX = r'\d'
#ONE_UPPERCASE_REGEX = r'[A-Z]'
#ONE_SPECIAL_CHAR_REGEX = r'[!@#$%^&*(),.?\':{}|<>_-]'

_crypto_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


class PasswordUtils:
    @staticmethod
    def hash_password(password: str) -> str:
        return _crypto_context.hash(password)

    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        return _crypto_context.verify(password, hashed_password)

    @staticmethod
    def is_password_valid(password: str) -> tuple[bool, str]:
        if len(password) < MIN_PASSWORD_LENGTH:
            return False, 'Пароль должен содержать хотя бы 8 символов'
        '''if not re.search(ONE_DIGIT_REGEX, password):
            return False, 'Пароль должен содержать хотя бы одну цифру'
        if not re.search(ONE_UPPERCASE_REGEX, password):
            return False, 'Пароль должен содержать хотя бы одну заглавную букву'
        if not re.search(ONE_SPECIAL_CHAR_REGEX, password):
            return False, 'Пароль должен содержать хотя бы один специальный символ'''
        return True, 'Пароль валиден'
