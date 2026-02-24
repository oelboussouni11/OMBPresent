from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.face_engine import get_face_embedding
from models import Member
import pickle

router = APIRouter()


@router.get("/groups/{group_id}/members")
def get_members(group_id: int, db: Session = Depends(get_db)):
    members = db.query(Member).filter(Member.group_id == group_id).all()
    result = []
    for m in members:
        result.append({
            "id": m.id,
            "first_name": m.first_name,
            "last_name": m.last_name,
            "created_at": m.created_at.isoformat(),
        })
    return {"status": "success", "data": result}


@router.post("/groups/{group_id}/members")
async def add_member(
    group_id: int,
    first_name: str = Form(...),
    last_name: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    image_bytes = await image.read()
    embedding, error = get_face_embedding(image_bytes)
    if error:
        return {"status": "error", "message": error}

    member = Member(
        first_name=first_name,
        last_name=last_name,
        group_id=group_id,
        face_encoding=pickle.dumps(embedding),
    )
    db.add(member)
    db.commit()
    db.refresh(member)

    return {"status": "success", "data": {
        "id": member.id,
        "first_name": member.first_name,
        "last_name": member.last_name,
    }}


@router.delete("/members/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        return {"status": "error", "message": "Member not found"}
    db.delete(member)
    db.commit()
    return {"status": "success", "message": "Member deleted"}