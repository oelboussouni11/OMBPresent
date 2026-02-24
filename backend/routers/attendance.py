from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.face_engine import get_face_embedding
from models import Member, Group, Attendance
from datetime import datetime, date
import numpy as np
import pickle

router = APIRouter()


@router.post("/groups/{group_id}/recognize")
async def recognize(group_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return {"status": "error", "message": "Group not found"}

    if not group.members:
        return {"status": "error", "message": "No members in this group"}

    image_bytes = await image.read()
    embedding, error = get_face_embedding(image_bytes)
    if error:
        return {"status": "error", "message": error}

    best_match = None
    best_score = 0

    for member in group.members:
        if not member.face_encoding:
            continue
        stored = pickle.loads(member.face_encoding)
        encodings = stored if isinstance(stored, list) else [stored]
        for enc in encodings:
            score = float(np.dot(embedding, enc) / (np.linalg.norm(embedding) * np.linalg.norm(enc)))
            if score > best_score:
                best_score = score
                best_match = member

    if best_score > 0.4 and best_match:
        # Check if already marked today
        today_start = datetime.combine(date.today(), datetime.min.time())
        existing = db.query(Attendance).filter(
            Attendance.member_id == best_match.id,
            Attendance.group_id == group_id,
            Attendance.timestamp >= today_start,
        ).first()

        if not existing:
            attendance = Attendance(
                member_id=best_match.id,
                group_id=group_id,
                confidence=round(best_score, 3),
            )
            db.add(attendance)
            db.commit()

        return {"status": "success", "data": {
            "name": f"{best_match.first_name} {best_match.last_name}",
            "confidence": round(best_score, 3),
            "timestamp": datetime.now().isoformat(),
            "already_marked": existing is not None,
        }}

    return {"status": "error", "message": "Face not recognized"}


@router.get("/groups/{group_id}/attendance")
def get_attendance(group_id: int, db: Session = Depends(get_db)):
    today_start = datetime.combine(date.today(), datetime.min.time())
    records = db.query(Attendance).filter(
        Attendance.group_id == group_id,
        Attendance.timestamp >= today_start,
    ).all()

    result = []
    for r in records:
        member = db.query(Member).filter(Member.id == r.member_id).first()
        result.append({
            "name": f"{member.first_name} {member.last_name}" if member else "Unknown",
            "confidence": r.confidence,
            "timestamp": r.timestamp.isoformat(),
        })

    return {"status": "success", "data": result}