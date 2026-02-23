from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.enroll import router as enroll_router
from routers.attendance import router as attendance_router

app = FastAPI(title="OMBPresent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(enroll_router, prefix="/api")
app.include_router(attendance_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "OMBPresent API is running"}