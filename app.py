import datetime
from typing import Optional
from fastapi import Depends, FastAPI, File, Form, HTTPException, Request, Response, UploadFile
from constants.query import CHANGE_PASSWORD, CHECK_PASSWORD, CREATE_EXPENSE, DELETE_EXPENSE, FETCH_CATEGORY, FETCH_EMAIL, FETCH_EXPENSE, FORGOT_PASSWORD, INSERT_CATEGORY, LOGIN, SELECT_PIE_EXPENSES, SELECT_TOP3_EXPENSES_OF_LAST_3_MONTHS_EACH, SIGNUP, UPDATE_USER
from db import run_query
from model.category import Category
from model.expense import Expense
from model.user import ChangePassword, ForgotPassword, UserLogIn, UserSignUp
import bcrypt
import jwt
from dotenv import load_dotenv
from utils import decodeJWT, getMonthFromNum, upload_image
load_dotenv()
import os,uvicorn
from fastapi.middleware.cors import CORSMiddleware
import json
from send_email import send_email

app = FastAPI()
# List of allowed origins (frontend URLs)
origins = [
    "http://localhost:5173",  
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
        result = run_query(SIGNUP,(user.name, user.email, hashed, salt))
        print("Inserted user ID:", result["last_insert_id"])

        
        return{"message": "User retrieved successfully"}
    except Exception as e:
        print(e)
        return{"message": "Try again"}
    
@app.post("/auth/login")
def login(user: UserLogIn,response:Response):
    result=run_query(LOGIN,(user.email,))
    if len(result)==0:
        response.status_code=400
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
        response.status_code=400
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
def user_profile(request:Request,user_id: str = Depends(decodeJWT)):
    try:
        result=run_query(FETCH_EMAIL,(user_id,))
        sliced=dict(list(result[0].items()))
        return {"message": "email fetched","data":sliced}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/user")
async def update_user(
    name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    file: Optional[UploadFile] = File(None),
    imgUrl: Optional[str]=Form(None),
    user_id: str = Depends(decodeJWT)
):
    try:
        image_url = imgUrl
        
        if file: 
            result = await upload_image(file)
            image_url = result["secure_url"]
            print(image_url)
        
        run_query(UPDATE_USER,(name,email,phone,image_url,user_id))
        return {"message": "User updated", "image": image_url,"user_name":name,"email":email,"phone":phone}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

    
@app.get("/expense")
def get_expense(request:Request,user_id: str = Depends(decodeJWT)):
    try:
        result=run_query(FETCH_EXPENSE,(user_id,))
        return {"message": "data fetched successfully", "data":result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/expense")
def create_expense(expense:Expense,user_id: str = Depends(decodeJWT)):
    try:
        result=run_query(CREATE_EXPENSE,
            (user_id,expense.exp_type,expense.exp_date,expense.exp_amount,expense.exp_des)
        )
        return{"message":"Expense created succuessfully","data":result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/expense/{expense_id}")
def delete_expense(expense_id: int,user_id: str = Depends(decodeJWT)):
    try:
        result = run_query(DELETE_EXPENSE,(user_id,expense_id))
        return{"message":"Sucessfully deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

@app.get("/category")
def get_cat():
    result=run_query(FETCH_CATEGORY)
    return{"message":"Category fetched successfully","data":result}

@app.post("/category")
def cat(request:Request,category:Category,user_id: str = Depends(decodeJWT)):
    try:
        result=run_query(INSERT_CATEGORY,(category.cat_name,))
        return{"message":"Category created succuessfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/charts/piechart")
def getPirchart(request:Request,user_id: str = Depends(decodeJWT)):
    try:
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/charts/barchart")
def getBarchart(request:Request,user_id: str = Depends(decodeJWT)):
    try:
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
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/change-password")
def changePassword(request:Request,changePassword:ChangePassword):
    user_id=changePassword.user_id
    if (changePassword.token!=None):
        token = changePassword.token
        SECRET_KEY=os.getenv("SECRET_KEY")
        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except:
            return{"message":"Invalid Token"}
        user_id=decoded["user_id"]
        print(user_id)
        
    result=run_query(CHECK_PASSWORD,(user_id,))
    if len(result)==0:
        return {"message": "Invalid user"}
    row=result[0]
    
    token = changePassword.token
    if(token == None):
        salt=row["salt"]
        salt_bytes=salt.encode('utf-8')
        password=changePassword.current_pass
        password_bytes=password.encode('utf-8')
        hashed=bcrypt.hashpw(password_bytes,salt_bytes)
        if row["user_password"]!=hashed.decode('utf-8'):
            print(hashed)
            print(row["user_password"])
            return {"message": "Invalid password"}
    
    
    password = changePassword.new_pass
    password_bytes= password.encode('utf-8')
    salt=bcrypt.gensalt()
    hashed=bcrypt.hashpw(password_bytes,salt)
    run_query(CHANGE_PASSWORD,(hashed,salt,user_id)
    )
    return{"message":"Password Updated Successfully"}
        
@app.post("/forgot-password")
def forgotPassword(requestBody:ForgotPassword):
    email = requestBody.email
    response= run_query(FORGOT_PASSWORD,(email,))
    if len(response)==0:
        return{"message":"Invalid email."}
    payload = {
    "user_id": response[0]["user_id"],
    "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)
    }
    SECRET_KEY=os.getenv("SECRET_KEY")
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    url='http://localhost:5173/change-password?token='+token
    send_email('Reset your password',url,email)
    return{"message":"Request sent"}
    


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # Render sets PORT automatically
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)