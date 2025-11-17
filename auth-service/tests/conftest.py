import pytest
from httpx import AsyncClient
from auth_service.__main__ import app


@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://localhost") as client:
        yield client
