from datetime import date
from pydantic import BaseModel

class Expense(BaseModel):
    exp_amount: float
    exp_type: int
    exp_des: str
    exp_date: date
