from pydantic import BaseModel
class UserData(BaseModel):
    gender: str
    fatScale: float
    bmi: float
    calorie: int
    water: float
    weightLoss: float   
    weight: int
    height: int
    age: int
    days: int
    previous_plan: list | None = None
    previous_stats: dict | None = None