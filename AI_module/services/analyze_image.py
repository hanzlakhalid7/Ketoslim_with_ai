import os
import google.generativeai as genai
from dotenv import load_dotenv
from services.logger import setup_logger

logger = setup_logger(__name__)

load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def analyze_image(image_base64: str):
    # 1. Use the 2.0 Flash model - it is the 2025 standard for vision
    model = genai.GenerativeModel("gemini-2.5-flash")

    # 2. Your Prompt
    prompt = """
    You are a highly experienced health, fitness, and body-composition analyst.
    Analyze the provided image of a single person and infer the attributes below using only visible physical cues (body shape, proportions, muscle definition, fat distribution, posture). These are approximate, non-medical estimates intended strictly for general fitness guidance.
    Required Output (estimate ALL fields):
    gender: "male" or "female"
    fatScale: estimated body fat percentage (number)
    weight: estimated body weight in kilograms (number)
    height: estimated height in centimeters (number)
    age: estimated age in years (number)
    bmi: calculated BMI (INTEGER ONLY)
    calorie: recommended daily calories to burn for healthy fat loss (number)
    water: recommended daily water intake in liters (number, may include decimals)
    weightLoss: recommended weight loss per week in pounds (number)
    days: estimated number of days required to reach a healthy BMI range (number)
    Strict Rules:
    Base estimates on realistic human physiology and established fitness standards.
    If uncertain, make the most statistically probable estimate from visual evidence.
    All values MUST be greater than zero.
    Use internally consistent calculations (height, weight, BMI must align).
    Do NOT explain reasoning.
    Do NOT include markdown, comments, labels, or extra text.
    Do NOT include nulls or placeholders.
    Output MUST be valid JSON only.
    Output MUST start with { and end with } exactly.
    Use numeric values only (no strings for numbers).
    Output Format:
    Return a single JSON object containing only the required fields, nothing else.
    """

    # 3. Prepare image data
    # Ensure image_base64 is the raw string, not the data:image/jpeg prefix
    image_data = {
        "mime_type": "image/jpeg",
        "data": image_base64
    }

    try:
        # 4. Generate content
        response = model.generate_content(
            [prompt, image_data],
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0.1
            }
        )

        if response.text:
            print(response.text)
            return response.text
        return None

    except Exception as e:
        logger.error(f"Error in analyze_image: {e}", exc_info=True)
        return None