from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.voice_auth import save_user, verify_user

router = APIRouter()

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register(user: UserLogin):
    save_user(user.username, user.password)
    return {"message": f"User {user.username} registered successfully"}

@router.post("/login")
async def login(user: UserLogin):
    result = verify_user(user.username, user.password)
    if result["match"]:
        return {"status": "success", "message": result["message"]}
    raise HTTPException(status_code=401, detail=result["message"])