from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

#from auth_service.utils.jwt_controller import create_token, decode_token




from t_service.schemas.trains import *
from t_service.utils.async_session import get_session, add_record_db, delete_record_db, update_record_db
from t_service.models.train_model import TrainersModel
from t_service.schemas.trains.request.train_request import NewTrainRequest
from t_service.utils.jwt_controller import decode_token

trainer_router: APIRouter = APIRouter(prefix='/client')


@trainer_router.post('/new_trainer')
async def new_trainer(trainer_request: NewTrainRequest, db: AsyncSession = Depends(get_session)):
    
    new_trainer: TrainersModel = TrainersModel(
        client_id=trainer_request.client_id,
        typetrain=trainer_request.typetrain,
        date_train_time=trainer_request.date_train_time,
        time_train=trainer_request.time_train,
        number_of_sets=trainer_request.number_of_sets,
        number_of_repetitions=trainer_request.number_of_repetitions
    )

    await add_record_db(db, new_trainer)

    return {'status': 'ok'}



@trainer_router.get("/my_trains")
async def get_my_trains(
    authorization: str = Header(...),
    db: AsyncSession = Depends(get_session)
):
    # ---------------------------
    # 1. Проверяем и достаём токен
    # ---------------------------
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Неверный формат токена")

    token = authorization.split(" ")[1]

    # ---------------------------
    # 2. Декодируем токен
    # ---------------------------
    payload = decode_token(token)
    client_id = payload.get("id")

    if not client_id:
        raise HTTPException(status_code=401, detail="Некорректный токен")

    # ---------------------------
    # 3. Ищем тренировки
    # ---------------------------
    query = select(TrainersModel).where(TrainersModel.client_id == client_id)
    result = await db.execute(query)
    trains = result.scalars().all()

    if not trains:
        return {"trains": [], "message": "У клиента пока нет тренировок"}

    return trains
