import os
import json

USERS_FILE = "voice_profiles/users.json"

def save_user(username: str, password: str) -> bool:
    os.makedirs("voice_profiles", exist_ok=True)
    users = load_users()
    users[username] = password
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)
    return True

def load_users() -> dict:
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def verify_user(username: str, password: str) -> dict:
    users = load_users()
    if username not in users:
        return {"match": False, "message": "User not found"}
    if users[username] == password:
        return {"match": True, "message": "Login successful"}
    return {"match": False, "message": "Wrong password"}