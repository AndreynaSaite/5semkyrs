from typing import List

import uvicorn
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware  # Импортируем CORSMiddleware

from t_service.routers import routers
from t_service.utils.config import config


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
    return app


def main() -> None:
    uvicorn.run(
        't_service.__main__:app',
        host=config.APP_HOST,
        port=config.APP_PORT,
        reload=True
    )


app: FastAPI = get_app()

if __name__ == '__main__':
    main()
