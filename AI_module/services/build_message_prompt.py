from models.UserData import UserData

def build_message_prompt(data: UserData):
    message_prompt = f"""As an elite Fitness & Nutrition Coach, generate exactly 6 highly motivational, 
    personalized coaching insights based on this user profile:

- Gender: {data.gender}
- Body Fat: {data.fatScale}%
- Weight: {data.weight}kg
- Height: {data.height}cm
- Age: {data.age}
- BMI: {data.bmi}
- Daily Calorie Target: {data.calorie} kcal
- Daily Water Goal: {data.water}L
- Target Weight Loss: {data.weightLoss}kg
- Timeline: {data.days} days

Rules for Content:
1. Message 1 (Body Fat): Focus on body composition and the strength of the journey ahead.
2. Message 2 (BMI): Provide an empowering perspective on moving toward a healthier range.
3. Message 3 (Calories): Frame the {data.calorie} calories as high-quality fuel for their specific goal.
4. Message 4 (Hydration): Highlight the metabolic power of hitting that {data.water}L water goal.
5. Message 5 (Metabolism/Biology): Explain how their consistency is "priming" their body for results.
6. Message 6 (Weight Loss Progress): Connect the {data.weightLoss}kg goal to their {data.days}-day commitment with a "finish line" mindset.

Constraints:
- Tone: Empathetic, energetic, and professional.
- Length: Exactly 4-5 lines per message.
- Output Format: Return ONLY a valid JSON array of strings. 
- No preamble, no markdown code blocks, no post-text.

Format: ["message1", "message2", "message3", "message4", "message5", "message6"]
    """
    return message_prompt