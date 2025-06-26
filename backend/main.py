import os
from fastapi import FastAPI
from api.endpoints import router as api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Configure CORS
app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"]
)

app.include_router(api_router)