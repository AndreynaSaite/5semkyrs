import jwt
import datetime

from auth_service.utils.config import config
from auth_service.errors.errors import InvalidTokenError, ExpiredTokenError


def create_token(data: dict) -> str:
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    data['exp'] = expiration
    token = jwt.encode(data, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGRORITHM)
    return token


def decode_token(token: str) -> dict:
    try:
        decoded_data = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGRORITHM])
        return decoded_data
    except jwt.ExpiredSignatureError:
        raise ExpiredTokenError(detail='The token has expired')
    except jwt.InvalidTokenError:
        raise InvalidTokenError(detail='Invalid token')
