from models.ImageRequest import ImageRequest
from services.analyze_image import analyze_image
from services.parsing_utils import extract_json_from_text
from fastapi import HTTPException
from services.logger import setup_logger

logger = setup_logger(__name__)

def getUserDetail(image_request: ImageRequest):
    # Ensure the image string doesn't have the prefix if passed, or clean it.
    # The prompt expects base64.
    image_data = image_request.image
    if "," in image_data:
        image_data = image_data.split(",")[1]
    
    content = analyze_image(image_data)
    
    if not content:
        raise HTTPException(status_code=500, detail="Failed to analyze image")

    data = extract_json_from_text(content)
    
    if not data:
        # Fallback or error
        logger.error(f"Failed to parse content: {content}")
        raise HTTPException(status_code=500, detail="Failed to parse AI response")
        
    return data