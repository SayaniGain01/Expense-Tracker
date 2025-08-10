from pydantic import BaseModel
class UserSignUp(BaseModel):
    name: str
    email: str
    password: str

class UserLogIn(BaseModel):
    email:str
    password:str

