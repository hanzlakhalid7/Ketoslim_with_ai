# Ketoslim with AI

Ketoslim with AI is a comprehensive health and wellness application that leverages Artificial Intelligence to provide personalized meal plans and insights. The project is composed of three main modules: an AI service, a Node.js backend, and a React frontend.

## Project Structure

- **AI_module**: A Python-based service using FastAPI and Google Generative AI (Gemini api) to generate meal plans and analyze user data.
- **backend**: A Node.js and Express server with TypeScript and MongoDB for user authentication and data persistence.
- **frontend**: A React application built with Vite and TypeScript, featuring a modern UI with TailwindCSS.

## Prerequisites

- Node.js (v18+ recommended)
- Python (v3.9+ recommended)
- MongoDB
- Git

## Quick Start / Installation

### 1. AI Module (Python/FastAPI)

Navigate to the `AI_module` directory:

```bash
cd AI_module
pip install -r requirements.txt
uvicorn main:app --reload
```
Server: `http://localhost:8000`

### 2. Backend (Node.js/Express)

Navigate to the `backend` directory:

```bash
cd backend
npm install
npm run dev
```
Server: `http://localhost:5000` (default)
**Note**: Create a `.env` file with `PORT`, `MONGODB_URI`, and `SESSION_SECRET`.

### 3. Frontend (React/Vite)

Navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```
Browser: `http://localhost:5173`

---

## Detailed Documentation

### Backend API (Node.js)

**Key Features:**
- Secure Authentication (JWT)
- Data Validation (Joi)
- Role-Based Access Control
- Logging (Winston)

**API Endpoints:**

#### Authentication (`/Auth`)
- `POST /Auth/register`: Register new user.
- `POST /Auth/login`: Login user.
- `GET /Auth/me`: Get current user profile.

#### Forms (`/Form`)
- `POST /Form/create`: Submit health form.
- `GET /Form/getById`: Get submitted forms.

#### Results (`/Result`)
- `POST /Result/resultSubmit`: Generate results.
- `GET /Result/getById`: Get analysis results.

#### Sales (`/Sales`)
- `POST /Sales/newProduct`: Create product (Admin).
- `GET /Sales/products`: List products.
- `POST /Sales/createOrder`: Create order.
- `POST /Sales/pay`: Pay for order.

#### Meal Plans (`/MealPlan`)
- `GET /MealPlan/get`: Get current latest meal plan.
- `GET /MealPlan/history`: Get history of saved meal plans.
- `POST /MealPlan/save`: Save a new meal plan.

---

### Frontend (React + Vite)

**Overview:**
A modern React app with Tailwind CSS, featuring:
- AI-powered health scanning.
- Dashboard for meal plan generation and history.
- Client-side routing with HashRouter support.
- Jest + React Testing Library integration.

**Scripts:**
- `npm run dev`: Start dev server.
- `npm run build`: Build for production.
- `npm run test`: Run tests.
- `npm run format`: Format code with Prettier.

---

### AI Module (Python/FastAPI)

**Features:**
- **Personalized Meal Plans**: 7-day diet plans.
- **Motivational Messages**: Encouraging tips.
- **Visual Health Analysis**: Estimates BMI, body fat, etc., from images using Google Gemini.

**Endpoints:**
- `POST /getMealPlan`: Generate diet plan.
- `POST /getMessages`: Generate motivational messages.
- `POST /getUserDetail`: Estimate body metrics from image.
"# ketoslim_final" 
