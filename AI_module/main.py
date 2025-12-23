from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.getMessages import getMessages
from models.UserData import UserData
from models.ImageRequest import ImageRequest
from controllers.getMealPlan import getMealPlan
from controllers.getUserDetail import getUserDetail

app = FastAPI()
# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------
# Mistral Endpoint
# ---------------------

@app.post("/getMessages")
def get_messages_endpoint(user_data: UserData):
    return getMessages(user_data)

@app.post("/getMealPlan")
def get_meal_plan_endpoint(user_data: UserData):
    return getMealPlan(user_data)

@app.post("/getUserDetail")
def get_user_detail_endpoint(image_request: ImageRequest):
    return getUserDetail(image_request)
