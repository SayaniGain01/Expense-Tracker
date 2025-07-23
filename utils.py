import os
from fastapi import Request
import jwt


def decodeJWT(request:Request):
    token = request.cookies.get("session_token")
    SECRET_KEY=os.getenv("SECRET_KEY")
    decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    user_id=decoded["user_id"]
    print(user_id)
    return user_id