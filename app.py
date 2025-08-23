import datetime
from fastapi import FastAPI, File, Form, Request, Response, UploadFile
from constants.query import SELECT_PIE_EXPENSES, SELECT_TOP3_EXPENSES_OF_LAST_3_MONTHS_EACH
from db import run_query
from model.category import Category
from model.expense import Expense
from model.user import UserLogIn, UserSignUp
import bcrypt
import jwt
from dotenv import load_dotenv
from utils import decodeJWT, getMonthFromNum, upload_image
load_dotenv()
import os
from fastapi.middleware.cors import CORSMiddleware
import json

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
        return{"message": "Try again"}
    
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
    "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=3)
    }
    SECRET_KEY=os.getenv("SECRET_KEY")
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    response.set_cookie(key="session_token", value=token, httponly=True, samesite="lax", secure=False)
    return {"message":"LogIn successful!"}

@app.get("/auth/logout")
def logout(response:Response):
    response.delete_cookie(key="session_token")
    return {"message": "Logged out"}

@app.get("/user")
def user_profile(request:Request):
    user_id=decodeJWT(request)
    result=run_query("SELECT user_name,email_id,image,user_id,phone FROM user WHERE user_id=%s",(user_id,))
    sliced=dict(list(result[0].items()))
    return {"message": "email fetched","data":sliced}

@app.put("/user")
async def update_user(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    file: UploadFile = File(...)
):
    user_id=decodeJWT(request)
    # Now file + form fields will work together
    result = await upload_image(file)
    run_query("UPDATE user SET user_name=%s,email_id=%s,phone=%s,image=%s WHERE user_id=%s",(name,email,phone,result["secure_url"],user_id))
    return {"message": "User updated", "image_url": result}

    
@app.get("/expense")
def get_expense(request:Request):
    user_id=decodeJWT(request)
    result=run_query('''SELECT expense.exp_amount,expense.exp_date,
        expense.exp_description,expense.exp_id,category.cat_name
        FROM expense,category
        WHERE expense.cat_id=category.cat_id AND user_id=%s''',(user_id,))
    return {"message": "data fetched successfully", "data":result}

@app.post("/expense")
def create_expense(request:Request,expense:Expense):
    user_id=decodeJWT(request)
    result=run_query(
        "INSERT INTO expense (user_id,cat_id,exp_date,exp_amount,exp_description) VALUES (%s,%s,%s,%s,%s)",
        (user_id,expense.exp_type,expense.exp_date,expense.exp_amount,expense.exp_des)
    )
    return{"message":"Expense created succuessfully","data":result}

@app.get("/category")
def get_cat():
    result=run_query(
        " SELECT * FROM category "
    )
    return{"message":"Category fetched successfully","data":result}

@app.post("/category")
def cat(request:Request,category:Category):
    user_id=decodeJWT(request)
    result=run_query(
        "INSERT INTO category (cat_name) VALUES (%s)",
        (category.cat_name,)
    )
    return{"message":"Category created succuessfully"}

@app.get("/charts/piechart")
def getPirchart(request:Request):
    user_id = decodeJWT(request)
    result=run_query(SELECT_PIE_EXPENSES, (user_id,))
    print(result)
    dataset = []
    for row in result:
        dataset.append({
            "label": row["cat_name"],
            "value":row["amount"],
            "id":row["cat_id"]
        })
    return {"dataset":dataset}

@app.get("/charts/barchart")
def getBarchart(request:Request):
    user_id=decodeJWT(request)
    result=run_query(SELECT_TOP3_EXPENSES_OF_LAST_3_MONTHS_EACH,(user_id,))
    print(result)
    output=[]
    series=set()
    for item in result:
        element=json.loads(item['result'])
        for key in element:
            series.add(key)
        element['month_']=getMonthFromNum(element['month_'])
        output.append(element)
        
    seriesFormatted=[]
    for item in series:
        if(item == 'month_'):
            continue
        seriesItem={"dataKey":item,"label":item}
        seriesFormatted.append(seriesItem)
    return{"dataset": output,"series":seriesFormatted}

