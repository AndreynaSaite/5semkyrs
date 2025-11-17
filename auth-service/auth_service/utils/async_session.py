from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.exc import IntegrityError, DataError, OperationalError
from auth_service.errors.errors import DataTypeError, DataValueError, DbOperationError, DbError
from typing import Callable

from auth_service.utils.config import config
from dotenv import load_dotenv


class SessionManager:
    def __init__(self) -> None:
        self.refresh()

    def __new__(cls):
        if not hasattr(cls, "instance"):
            cls.instance = super(SessionManager, cls).__new__(cls)
        return cls.instance  # noqa

    def get_session_maker(self) -> sessionmaker:
        return sessionmaker(self.engine, class_=AsyncSession, expire_on_commit=False) # type: ignore

    def refresh(self) -> None:
        self.engine = create_async_engine(config.DB_URL, echo=False, future=True)


async def get_session() -> AsyncSession: # type: ignore
    session_maker = SessionManager().get_session_maker()
    async with session_maker() as session:
        yield session  # type: ignore


def record_error_handler(func):
    async def wrapper(db: AsyncSession, record: DeclarativeMeta, is_refresh: bool = True):
        try:
            return await func(db, record, is_refresh)
        except IntegrityError as e:
            await db.rollback()
            raise DataValueError(str(e.orig))
        except DataError as e:
            await db.rollback()
            raise DataTypeError(str(e.orig))
        except OperationalError as e:
            await db.rollback()
            raise DbOperationError(str(e.orig))
        except Exception as e:
            await db.rollback()
            raise DbError(str(e))
    return wrapper


@record_error_handler
async def add_record_db(db: AsyncSession, record: DeclarativeMeta, is_refresh: bool = True) -> None:
    db.add(record)
    await db.commit()
    if is_refresh:
        await db.refresh(record)


@record_error_handler
async def delete_record_db(db: AsyncSession, record: DeclarativeMeta, is_refresh: bool = True) -> None:
    await db.delete(record)
    await db.commit()
    if is_refresh:
        await db.refresh(record)


@record_error_handler
async def update_record_db(db: AsyncSession, record: DeclarativeMeta, is_refresh: bool = True) ->  None:
    await db.commit()
    if is_refresh:
        await db.refresh(record)


load_dotenv()
