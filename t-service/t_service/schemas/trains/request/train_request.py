from pydantic import BaseModel, field_validator, EmailStr
from datetime import datetime, time

class NewTrainRequest(BaseModel):
    client_id: int
    typetrain: str
    date_train_time: datetime
    time_train: time
    number_of_sets: int
    number_of_repetitions: int
    #jwt: str