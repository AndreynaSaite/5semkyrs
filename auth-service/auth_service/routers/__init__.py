from fastapi import APIRouter
from typing import List
from auth_service.routers.client import client_router


routers: List[APIRouter] = [
    client_router
]

__all__ = [
    'routers'
]
