from sqlalchemy import Column, Integer, Enum, TIMESTAMP, TIME, ForeignKey
from sqlalchemy.orm import relationship
from t_service.models import BaseModel  # если BaseModel общий


class TrainersModel(BaseModel):
    __tablename__ = 'users_trainer'

    id = Column(Integer, primary_key=True, autoincrement=True)  # id самой тренировки
    client_id = Column(Integer, nullable=False)
    typetrain = Column(Enum('Пресс', 'Ягодицы','Руки','Cпина','Ноги','Грудь', name='typetrain'), nullable=False)
    date_train_time = Column(TIMESTAMP(timezone=True), nullable=False)
    time_train = Column(TIME, nullable=False)
    number_of_sets = Column(Integer, nullable=False)
    number_of_repetitions = Column(Integer, nullable=False)