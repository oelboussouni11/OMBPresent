from fastapi import APIRouter, UploadFile, File
from app.face_engine import recognize_face
from datetime import datetime

router = APIRouter()

attendance_log = []


@router.post("/recognize")
async def recognize(image: UploadFile = File(...)):
    image_bytes = await image.read()
    result, error = recognize_face(image_bytes)

    if error:
        return {"status": "error", "message": error}

    entry = {
        "name": result["name"],
        "confidence": result["confidence"],
        "timestamp": datetime.now().isoformat(),
    }
    attendance_log.append(entry)
    return {"status": "success", "data": entry}


@router.get("/attendance")
async def get_attendance():
    return {"status": "success", "data": attendance_log}