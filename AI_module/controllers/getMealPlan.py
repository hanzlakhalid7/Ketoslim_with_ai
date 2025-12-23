from services.communication_with_api import communication_with_api
from services.build_diet_plan_prompt import build_diet_plan_prompt
from models.UserData import UserData
from services.parsing_utils import extract_json_from_text
from services.logger import setup_logger

logger = setup_logger(__name__)

def getMealPlan(user_data: UserData):
    print(user_data)
    prompt = build_diet_plan_prompt(user_data)
    content = communication_with_api(prompt)
    
    plan = extract_json_from_text(content)
    
    if plan:
        print("✓ Successfully parsed meal plan")
        return {"plan": plan}
    else:
        logger.error(f"Could not parse meal plan. Raw: {content}")
        return {"plan": [], "raw_content": content}
