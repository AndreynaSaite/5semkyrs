from pydantic import BaseModel


class ClientUpdateResponse(BaseModel):
    status: str
