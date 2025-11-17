from typing import Generator

from sqlalchemy import create_engine, Engine
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker, Session

from t_service.models import BaseModel
from t_service.utils.config import config



def get_session() -> Generator[Session, None, None]:
    with SessionMaker() as session:
        yield session


load_dotenv()
engine: Engine = create_engine(config.DB_URL)
BaseModel.metadata.create_all(bind=engine)
SessionMaker = sessionmaker(bind=engine)
