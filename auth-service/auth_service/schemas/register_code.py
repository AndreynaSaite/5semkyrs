from pydantic import BaseModel, Field


class RegisterCode(BaseModel):
    code: int = Field(..., ge=100000, le=999999)
