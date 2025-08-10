import os
from fastapi import File, Request, UploadFile
import jwt
import cloudinary
import cloudinary.uploader


def decodeJWT(request:Request):
    token = request.cookies.get("session_token")
    SECRET_KEY=os.getenv("SECRET_KEY")
    decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    user_id=decoded["user_id"]
    print(user_id)
    return user_id

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