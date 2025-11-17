from pydantic import BaseModel


class ClientDeleteResponse(BaseModel):
    status: str
