from fastapi import APIRouter, UploadFile, File, Form
from app.face_engine import enroll_face

router = APIRouter()


@router.post("/enroll")
async def enroll(name: str = Form(...), image: UploadFile = File(...)):
    image_bytes = await image.read()
    success, message = enroll_face(name, image_bytes)

    if success:
        return {"status": "success", "message": message}
    return {"status": "error", "message": message}