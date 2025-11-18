from sqlalchemy import Column, Integer, Enum, TIMESTAMP, TIME, ForeignKey, JSON, BOOLEAN
from sqlalchemy.orm import relationship
from t_service.models import BaseModel  # если BaseModel общий


class TrainersModel(BaseModel):
    __tablename__ = 'users_trainer'

    id = Column(Integer, primary_key=True, autoincrement=True)  # id самой тренировки
    client_id = Column(Integer, nullable=False)
    typetrain = Column(Enum('Пресс', 'Ягодицы','Руки','Cпина','Ноги','Грудь','Кардио','Растяжка', name='typetrain'), nullable=False)
    date_train_time = Column(TIMESTAMP(timezone=True), nullable=False)
    time_train = Column(TIME, nullable=False)
    end_time = Column(TIME, nullable=False)
    exercises = Column(JSON, nullable=False)
    is_ready = Column(BOOLEAN, nullable=False)