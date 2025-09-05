from typing import Optional
from pydantic import BaseModel
class UserSignUp(BaseModel):
    name: str
    email: str
    password: str

class UserLogIn(BaseModel):
    email:str
    password:str

class ChangePassword(BaseModel):
    current_pass: str
    new_pass: str
    confirm_pass: str
    token: Optional[str] = None
    user_id: Optional[int] = None
    
class ForgotPassword(BaseModel):
    email:str