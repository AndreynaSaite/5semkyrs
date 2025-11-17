from fastapi import APIRouter
from typing import List
from t_service.routers.trainers import trainer_router


routers: List[APIRouter] = [
    trainer_router
]

__all__ = [
    'routers'
]
