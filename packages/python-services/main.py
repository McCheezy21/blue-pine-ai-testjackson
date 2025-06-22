"""
Blue Pine AI - Python Services
Main FastAPI application for ML, automation, and Bedrock integration
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers (will be created)
from bedrock.router import router as bedrock_router
from automation.router import router as automation_router
from ml_models.router import router as ml_router
from data_processing.router import router as data_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    # Startup
    print("🚀 Starting Blue Pine AI Python Services...")
    
    # Initialize ML models, database connections, etc.
    # await initialize_ml_models()
    # await setup_database_connections()
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Blue Pine AI Python Services...")
    # Cleanup resources
    # await cleanup_ml_models()
    # await close_database_connections()

# Create FastAPI app
app = FastAPI(
    title="Blue Pine AI - Python Services",
    description="Machine Learning, Automation, and AI Services for Healthcare",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8084", "http://localhost:3001"],  # Frontend and backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "blue-pine-python-services",
        "version": "1.0.0"
    }

# Include routers
app.include_router(bedrock_router, prefix="/bedrock", tags=["AWS Bedrock"])
app.include_router(automation_router, prefix="/automation", tags=["Automation"])
app.include_router(ml_router, prefix="/ml", tags=["Machine Learning"])
app.include_router(data_router, prefix="/data", tags=["Data Processing"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PYTHON_SERVICE_PORT", 8000)),
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    ) 