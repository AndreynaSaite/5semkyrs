import jwt
import datetime

from t_service.utils.config import config
#from t_service.errors.errors import InvalidTokenError, ExpiredTokenError


'''def create_token(data: dict) -> str:
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    data['exp'] = expiration
    token = jwt.encode(data, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGRORITHM)
    return token
'''
class trainServiceError(Exception):
    def __init__(self, detail: str) -> None:
        super().__init__()
        self.name = self.__class__.__name__
        self.detail: str = detail


class InvalidTokenError(trainServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)


class ExpiredTokenError(trainServiceError):
    def __init__(self, detail: str) -> None:
        super().__init__(detail)

def decode_token(token: str) -> dict:
    try:
        decoded_data = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGRORITHM])
        return decoded_data
    except jwt.ExpiredSignatureError:
        raise ExpiredTokenError(detail='The token has expired')
    except jwt.InvalidTokenError:
        raise InvalidTokenError(detail='Invalid token')
