from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from auth_service.models.clients_model import ClientsModel
from auth_service.schemas.client import *
from auth_service.utils.async_session import get_session, add_record_db, delete_record_db, update_record_db
from auth_service.utils.password_utils import PasswordUtils
from auth_service.utils.jwt_controller import create_token, decode_token
from auth_service.errors.errors import IncorrcetEmailOrPasswordError


client_router: APIRouter = APIRouter(prefix='/client')


@client_router.post('/login', response_model=ClientLoginResponse)
async def login_client(login_request: ClientLoginRequest, db: AsyncSession = Depends(get_session)):
    result = await db.execute(select(ClientsModel).filter(ClientsModel.email == login_request.email))
    client: ClientsModel | None = result.scalars().first()
    if not client or not PasswordUtils.verify_password(login_request.password, str(client.password)):
        ### logger.error(f'Client {login_request.email} failed to log in')
        raise IncorrcetEmailOrPasswordError(detail='Incorrcet email')

    ### logger.info(f'Client {client.email} logged in')
    return ClientLoginResponse(
        status='ok',
        JWT=create_token({
            'id': client.id,
            'email': str(client.email),
            'full_name': client.full_name,
        })
    )


@client_router.post('/register', response_model=ClientRegisterResponse)
async def register_client(register_request: ClientRegisterRequest, db: AsyncSession = Depends(get_session)):
    new_client: ClientsModel = ClientsModel(
        email=str(register_request.email),
        password=PasswordUtils.hash_password(register_request.password),
        full_name=register_request.full_name,
    )

    await add_record_db(db, new_client)

    ### logger.info(f'client {new_client.email} registered')
    return ClientRegisterResponse(
        status='ok',
        JWT=create_token({
            'id': new_client.id,
            'email': str(new_client.email),
            'full_name': new_client.full_name,
        })
    )


# @client_router.put('/update', response_model=ClientUpdateResponse)
# async def update_client(update_request: ClientUpdateRequest, db: AsyncSession = Depends(get_session)):
#     token_data: dict = decode_token(update_request.JWT)
#     result = await db.execute(select(ClientsModel).filter(ClientsModel.id == token_data['id']))
#     client: ClientsModel | None = result.scalars().first()
#     if client is None:
#         raise HTTPException(status_code=400, detail='client not found')
#
#     if update_request.email:
#         client.email = str(update_request.email) # type: ignore
#     if update_request.TIN:
#         ### logger.info(f'client {client.email} updated TIN')
#         client.tin = update_request.TIN # type: ignore
#     if update_request.phone_number:
#         ### logger.info(f'client {client.email} updated phone number')
#         client.phone_number = update_request.phone_number # type: ignore
#     if update_request.company:
#         ### logger.info(f'client {client.email} updated company name')
#         client.company = update_request.company # type: ignore
#
#     await update_record_db(db, client)
#
#     ### logger.info(f'client {client.email} updated')
#
#     return ClientUpdateResponse(status='ok')
#
#
# @client_router.delete('/delete', response_model=ClientDeleteResponse)
# async def delete_client(delete_request: ClientDeleteRequest, db: AsyncSession = Depends(get_session)):
#     token_data: dict = decode_token(delete_request.JWT)
#     result = await db.execute(select(ClientsModel).filter(ClientsModel.id == token_data['id']))
#     client: ClientsModel | None = result.scalars().first()
#     if client is None:
#         raise HTTPException(status_code=400, detail='Client not found')
#
#     await delete_record_db(db, client)
#
#     return ClientDeleteResponse(status='ok')
