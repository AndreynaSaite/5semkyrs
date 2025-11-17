from pydantic import BaseModel


class ClientRegisterResponse(BaseModel):
    status: str
    JWT: str
