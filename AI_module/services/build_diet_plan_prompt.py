from models.UserData import UserData

def build_diet_plan_prompt(data: UserData):
    
    context_str = ""
    if data.previous_stats:
        context_str += f"\nBACKGROUND CONTEXT:\nPrevious Stats: Weight {data.previous_stats.get('weight')}kg, Fat {data.previous_stats.get('fatScale')}%\n"
        if data.previous_stats.get('weight'):
             context_str += f"User Progress: {data.previous_stats.get('weight')}kg -> {data.weight}kg\n"
    
    if data.previous_plan:
        context_str += f"Previous Cycle Meal Plan: {data.previous_plan}\n"
        context_str += "INSTRUCTION: Provide a NEW plan that offers variety from the previous one while adhering to the new stats.\n"

    prompt = f"""As an expert Nutritionist, generate a customized 7-day diet plan based on this user profile:

- Gender: {data.gender}
- Body Fat: {data.fatScale}%
- BMI: {data.bmi}
- Weight: {data.weight}kg
- Height: {data.height}cm
- Age: {data.age}
- Daily Calorie Target: {data.calorie} kcal
- Daily Water Goal: {data.water}L
- Target Weight Loss: {data.weightLoss}kg
- Timeline: {data.days} days
{context_str}

Instructions:
1. Provide a 7-day meal plan.
2. For each day, include: Breakfast, Lunch, Snack, Dinner.
3. Ensure the meals align with the daily calorie target of {data.calorie} kcal.
4. Keep the descriptions concise but appetizing.

Output Format:
Return ONLY a valid JSON array of objects. No markdown code blocks. No preamble.
The JSON structure must be strict:

[
  {{
    "day": "Day 1",
    "breakfast": "...",
    "lunch": "...",
    "snack": "...",
    "dinner": "..."
  }},
  ...
]
"""
    return prompt
