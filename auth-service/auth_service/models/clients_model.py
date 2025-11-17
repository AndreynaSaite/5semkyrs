from sqlalchemy import Column, INT, VARCHAR, BOOLEAN, TEXT
from sqlalchemy.orm import relationship
from auth_service.models import BaseModel

class ClientsModel(BaseModel):
    __tablename__ = 'users_user'
    
    id = Column(INT, primary_key=True, index=True)
    email = Column(VARCHAR(254), nullable=False, unique=True)
    password = Column(VARCHAR(255), nullable=False)
    full_name = Column(VARCHAR(255), nullable=False)
