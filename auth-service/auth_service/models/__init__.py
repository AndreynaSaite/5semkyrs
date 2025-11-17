from sqlalchemy.orm import declarative_base
from sqlalchemy.orm.decl_api import DeclarativeMeta


BaseModel: DeclarativeMeta = declarative_base()

__all__ = [
    'BaseModel',
]
