from typing import List

import uvicorn
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware  # Импортируем CORSMiddleware

from auth_service.routers import routers
from auth_service.utils.config import config
from auth_service.errors.error_handler import bind_error_handlers


def bind_routers(app: FastAPI, routers: List[APIRouter]) -> None:
    for router in routers:
        app.include_router(router)


def get_app() -> FastAPI:
    app: FastAPI = FastAPI(title='TED Auth Service')

    # Добавляем CORS middleware
    origins = ["*"]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,  # Разрешаем доступ только с указанных доменов
        allow_credentials=True,
        allow_methods=["*"],  # Разрешаем все HTTP-методы
        allow_headers=["*"],  # Разрешаем все заголовки
    )

    bind_routers(app, routers)
    bind_error_handlers(app)
    return app


def main() -> None:
    uvicorn.run(
        'auth_service.__main__:app',
        host=config.APP_HOST,
        port=config.APP_PORT,
        reload=True
    )


app: FastAPI = get_app()

if __name__ == '__main__':
    main()
