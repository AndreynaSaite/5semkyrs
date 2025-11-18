from pydantic import BaseModel
from datetime import datetime, time
from typing import List


class Exercise(BaseModel):
    name: str
    sets: int
    reps: int


class NewTrainRequest(BaseModel):
    client_id: int
    typetrain: str
    date_train_time: datetime
    time_train: time
    end_time: time
    exercises: List[Exercise]
    is_ready: bool