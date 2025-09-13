import os
from fastapi import File, HTTPException, Request, UploadFile, status
import jwt
import cloudinary
import cloudinary.uploader


# def decodeJWT(request:Request):
#     token = request.cookies.get("session_token")
#     SECRET_KEY=os.getenv("SECRET_KEY")
#     decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
#     user_id=decoded["user_id"]
#     print(user_id)
#     return user_id

def decodeJWT(request: Request):
    SECRET_KEY=os.getenv("SECRET_KEY")
    try:
        token = request.cookies.get("session_token")  # or from headers if you send it in headers
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing"
            )

        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
        
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


async def upload_image(file: UploadFile = File(...)):
    try:
        # Configure Cloudinary inside the function
        cloudinary.config(
            cloud_name=os.getenv("CLOUD_NAME"),
            api_key=os.getenv("API_KEY"),
            api_secret=os.getenv("API_SECRET"),
            secure=True
        )
        
        # Read file content
        contents = await file.read()

        # Upload to Cloudinary using the file content with explicit config
        result = cloudinary.uploader.upload(
            contents, 
            resource_type="image",
            cloud_name=os.getenv("CLOUD_NAME"),
            api_key=os.getenv("API_KEY"),
            api_secret=os.getenv("API_SECRET")
        )

        # Return Cloudinary URL
        return {"secure_url": result["secure_url"]}

    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}
    
def getMonthFromNum(num):
    months=["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[num-1]