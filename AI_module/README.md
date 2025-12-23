# AI-Powered Fitness Backend

This is a FastAPI-based backend service providing AI-driven diet planning, motivational messaging, and visual user analysis Google Gemini models.

## Features

- **Personalized Meal Plans**: Generates 7-day diet plans based on user metrics.
- **Motivational Messages**: Provides encouraging messages tailored to the user's journey.
- **Visual Health Analysis**: Estimates health metrics (BMI, caloriesBurned,Height,Weight,Gender,Age,BodyFat,WaterIntake, WeightLoss,Days_to_reach_healthy_BMI_range) from user images.

## Technology Stack

- **Framework**: FastAPI (Python)
- **AI Integration**:
- **Google Gemini**: Used for text generation (diet plans, motivational messages) and vision/image analysis.
- **Validation**: Pydantic models.
- **Server**: Uvicorn.

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd backend
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory and add your API keys:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    ```
    > **Note**: Ensure your `GEMINI_API_KEY` has the Google Generative AI API enabled and access to `gemini-2.5-flash` model.

4.  **Run the Server**:
    ```bash
    uvicorn main:app --reload
    ```
    The server works at `http://127.0.0.1:8000`.

## API Endpoints

### 1. Get Meal Plan
**Endpoint:** `POST /getMealPlan`

Generates a 7-day customised diet plan.

**Request Body** (`UserData`):
```json
{
  "gender": "male",
  "fatScale": 20.0,
  "bmi": 22.5,
  "calorie": 2500,
  "water": 3.0,
  "weightLoss": 5.0,
  "weight": 70,
  "height": 175,
  "age": 25,
  "days": 7
}
```

**Response**:
Returns a JSON object containing the `plan` (array of daily meals).

### 2. Get Messages
**Endpoint:** `POST /getMessages`

Generates motivational tips and messages.

**Request Body** (`UserData`):
Same fields as `/getMealPlan`.

**Response**:
Returns a JSON object containing `messages` (list of strings).

### 3. Get User Detail (Image Analysis)
**Endpoint:** `POST /getUserDetail`

Estimates body metrics from an image.

**Request Body** (`ImageRequest`):
```json
{
  "image": "base64_encoded_image_string_here"
}
```

**Response**:
Returns predicted metrics:
```json
{
  "gender": "male",
  "fatScale": 20.0,
  "bmi": 22.5,
  "calorie": 2500,
  "water": 3.0,
  "weightLoss": 5.0,
  "weight": 70,
  "height": 175,
  "age": 25,
  "days": 7
}
```

## Project Structure

- `main.py`: Application entry point and route definitions.
- `models/`: Pydantic data models (`UserData`, `ImageRequest`).
- `controllers/`: Logic handlers for each endpoint (`getMealPlan`, `getMessages`, `getUserDetail`).
- `services/`: Helper functions.
    - `analyze_image.py`: Gemini Vision integration.
    - `communication_with_api.py`: Gemini Text generation.
    - `parsing_utils.py`: Robust JSON extraction helper.

## Troubleshooting

- **404 Not Found (Gemini)**: Verify your Google Cloud project has the *Generative Language API* enabled and your API key is correct. Check regional availability for `gemini-2.5-flash`.
- **500 Internal Error**: Check the server logs. Common causes are invalid JSON responses from AI provider (handled by `parsing_utils`) or API connection issues.