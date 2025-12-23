import os
import google.generativeai as genai
from dotenv import load_dotenv
from services.logger import setup_logger

logger = setup_logger(__name__)

load_dotenv()

# Configure the Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def communication_with_api(prompt: str):
    model = genai.GenerativeModel("gemini-2.5-flash")
    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.1,
            }
        )
        if response.text:
            return response.text
        return {"error": "The model returned an empty response."}
    except Exception as e:
        logger.error(f"Error in communication_with_api: {e}", exc_info=True)
        return {"error": str(e)}