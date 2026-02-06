# Project: Human Error Shield

## Project Overview
The "Human Error Shield" is a comprehensive system designed to detect safety equipment, specifically helmets, in real-time to mitigate workplace accidents. It comprises three main components: a FastAPI backend, a React frontend, and a machine learning model for object detection.

**Key Features:**
*   Real-time detection of safety equipment (helmets, no_helmet) using a YOLOv8 model.
*   Risk assessment and alerts based on detected safety equipment.
*   Web interface for monitoring video streams, predictions, and potentially administrative tasks.
*   API endpoints for predictions and video processing.

**Architecture:**
1.  **Human Error Shield Backend (`human-error-shield-backend/`):**
    *   A Python-based API built with FastAPI.
    *   Handles video stream processing and serves real-time object detection predictions.
    *   Uses a `YOLOService` to interact with the trained YOLO model.
    *   Configured with CORS middleware for frontend communication.
2.  **Human Error Shield Frontend (`human-error-shield-frontend/`):**
    *   A web application developed with React and Vite.
    *   Provides a user interface for displaying video feeds, detection results, and risk alerts.
    *   Utilizes `react-router-dom` for navigation (Dashboard, Admin, History).
    *   Styled using Tailwind CSS.
    *   Communicates with the backend API.
3.  **Human Error Shield Model (`human-error-shield-model/`):**
    *   Contains the core machine learning assets, including:
        *   A dataset for training and validation of the object detection model.
        *   Trained YOLOv8 models (e.g., `safety_detector_v13/weights/best.pt`).
        *   A Jupyter Notebook (`human_error_shield.ipynb`) detailing the model training, validation, and real-time testing process.
        *   `data.yaml` defines the dataset paths and class names (`helmet`, `no_helmet`).

## Building and Running

### 1. Model Setup (human-error-shield-model)
This component is primarily for training and evaluation.

**Dependencies:**
Install Python dependencies:
```bash
pip install -r human-error-shield-model/requirements.txt
```

**Training/Validation/Testing:**
The core model operations (training, validation, real-time detection) are documented and executed within the Jupyter Notebook:
`human-error-shield-model/notebooks/human_error_shield.ipynb`
To run this notebook, start a Jupyter server in the `human-error-shield-model/` directory:
```bash
jupyter notebook
```
Then open and execute the `human_error_shield.ipynb` notebook.

### 2. Backend Setup (human-error-shield-backend)
This is a FastAPI application that serves the detection model.

**Dependencies:**
The backend relies on the model's dependencies and FastAPI. Ensure `uvicorn` and `fastapi` are installed.
```bash
pip install "fastapi[all]" uvicorn ultralytics opencv-python torch torchvision
# Or use the requirements.txt from the model directory if it covers all backend needs
# pip install -r ../human-error-shield-model/requirements.txt
```

**Running the Backend:**
Navigate to the `human-error-shield-backend/` directory and run the application using Uvicorn:
```bash
uvicorn app.main:app --reload --port 8000
```
The API will be accessible at `http://127.0.0.1:8000`.

### 3. Frontend Setup (human-error-shield-frontend)
This is a React application that interacts with the backend.

**Dependencies:**
Navigate to the `human-error-shield-frontend/` directory.
Install Node.js dependencies:
```bash
npm install
# or
yarn install
```

**Running the Frontend (Development):**
```bash
npm run dev
# or
yarn dev
```
The application will typically be available at `http://localhost:5173`.

**Building the Frontend:**
```bash
npm run build
# or
yarn build
```

## Development Conventions

*   **Backend:** Python-based using FastAPI. Follows standard Python best practices.
*   **Frontend:** React functional components, Vite for tooling, Tailwind CSS for styling. ESLint is configured for code quality.
*   **Model:** Python, primarily using the `ultralytics` library for YOLOv8. Jupyter notebooks are used for experimentation and workflow documentation.
