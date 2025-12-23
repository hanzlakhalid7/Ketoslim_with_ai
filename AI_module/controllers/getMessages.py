from services.communication_with_api import communication_with_api
from services.build_message_prompt import build_message_prompt
from models.UserData import UserData
from services.parsing_utils import extract_json_from_text
from services.logger import setup_logger

logger = setup_logger(__name__)

def getMessages(user_data: UserData):
    message_prompt = build_message_prompt(user_data)
    content = communication_with_api(message_prompt)
    
    messages = extract_json_from_text(content)
    
    if messages:
        print("✓ Successfully parsed messages")
        return {"messages": messages}
    else:
        logger.error(f"Could not parse content. Raw: {content}")
        return {"messages": [content]}