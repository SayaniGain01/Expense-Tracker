import datetime
from fastapi import FastAPI, Request, Response
from db import run_query
from model.category import Category
from model.expense import Expense
from model.user import UserLogIn, UserSignUp
import bcrypt
import jwt
from dotenv import load_dotenv
from utils import decodeJWT
load_dotenv()
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# List of allowed origins (frontend URLs)
origins = [
    "http://localhost:5173",  # React dev server
    "https://your-frontend.com",  # Production frontend domain
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.post("/auth/signup")
def signUp(user: UserSignUp):
    try:
        password = user.password
        password_bytes= password.encode('utf-8')
        salt=bcrypt.gensalt()
        hashed=bcrypt.hashpw(password_bytes,salt)
        result = run_query(
            "INSERT INTO user (user_name, email_id, user_password, salt) VALUES (%s, %s, %s, %s)",
            (user.name, user.email, hashed, salt)
        )
        print("Inserted user ID:", result["last_insert_id"])

        
        return{"message": "User retrieved successfully"}
    except Exception as e:
        print(e)
        return{"message": "Try again bitches"}
    
@app.post("/auth/login")
def login(user: UserLogIn,response:Response):
    result=run_query(
        "SELECT * FROM  user WHERE email_id = %s ",
        (user.email,)
    )
    if len(result)==0:
        return {"message": "Invalid email id or password"}
    row=result[0]
    salt=row["salt"]
    salt_bytes=salt.encode('utf-8')
    password=user.password
    password_bytes=password.encode('utf-8')
    hashed=bcrypt.hashpw(password_bytes,salt_bytes)
    if row["user_password"]!=hashed.decode('utf-8'):
        print(hashed)
        print(row["user_password"])
        return {"message": "Invalid email id or password"}
    payload = {
    "user_id": row["user_id"],
    "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
    }
    SECRET_KEY=os.getenv("SECRET_KEY")
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    response.set_cookie(key="session_token", value=token, httponly=True, samesite="lax", secure=False)
    return {"message":"LogIn successful!"}

@app.get("/user")
def user_profile(request:Request):
    user_id=decodeJWT(request)
    result=run_query("SELECT * FROM user WHERE user_id=%s",(user_id,))
    sliced=dict(list(result[0].items())[:4])
    return {"message": "email fetched","data":sliced}
    

@app.get("/expense")
def get_expense(request:Request):
    user_id=decodeJWT(request)
    result=run_query("SELECT * FROM expense WHERE user_id=%s",(user_id,))
    return {"message": "data fetched successfully", "data":result}

@app.post("/expense")
def create_expense(request:Request,expense:Expense):
    user_id=decodeJWT(request)
    result=run_query(
        "INSERT INTO expense (user_id,cat_id,exp_date,exp_amount,exp_description) VALUES (%s,%s,%s,%s,%s)",
        (user_id,expense.exp_type,expense.exp_date,expense.exp_amount,expense.exp_des)
    )
    return{"message":"Expense created succuessfully"}

@app.post("/category")
def cat(request:Request,category:Category):
    user_id=decodeJWT(request)
    result=run_query(
        "INSERT INTO category (cat_name) VALUES (%s)",
        (category.cat_name,)
    )
    return{"message":"Category created succuessfully"}
