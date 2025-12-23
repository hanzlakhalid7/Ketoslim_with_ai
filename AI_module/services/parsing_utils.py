import json
import re

def extract_json_from_text(text: str):
    """
    Attempts to extract and parse the first valid JSON object or array from a string.
    Handles markdown code blocks and surrounding text.
    """
    if isinstance(text, (dict, list)):
        return text
        
    try:
        # 1. Try direct parsing first
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 2. Try to find JSON block in markdown
    # Match ```json ... ``` or just ``` ... ```
    match = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass

    # 3. Try finding the first '{' and last '}'
    # This assumes an object is returned
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1 and end > start:
        json_str = text[start:end+1]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
            
    # 4. Try finding the first '[' and last ']' (for arrays)
    start = text.find('[')
    end = text.rfind(']')
    if start != -1 and end != -1 and end > start:
        json_str = text[start:end+1]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass

    # Return None or raise error if nothing found
    return None
