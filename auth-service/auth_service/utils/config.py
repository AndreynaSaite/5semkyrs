from os import environ
from pydantic_settings import BaseSettings
from dotenv import load_dotenv


load_dotenv()


class Config(BaseSettings):
    DB_NAME: str = environ.get('DB_NAME', '')
    DB_USERNAME: str = environ.get('DB_USERNAME', '')
    DB_PASSWORD: str = environ.get('DB_PASSWORD', '')
    DB_HOST: str = environ.get('DB_HOST', '0.0.0.0')
    DB_PORT: int = int(environ.get('DB_PORT', 5432))
    APP_HOST: str = environ.get('APP_HOST', '0.0.0.0')
    APP_PORT: int = int(environ.get('APP_PORT', 8085))
    JWT_SECRET_KEY: str = environ.get('JWT_SECRET_KEY', 'example_key')
    JWT_ALGRORITHM: str = environ.get('JWT_ALGRORITHM', 'HS256')

    @property
    def DB_URL(self) -> str:
        return f'postgresql+asyncpg://{self.DB_USERNAME}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}'


config: Config = Config()
