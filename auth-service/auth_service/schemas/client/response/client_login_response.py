from pydantic import BaseModel


class ClientLoginResponse(BaseModel):
    status: str
    JWT: str
