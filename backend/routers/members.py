from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.face_engine import get_face_embedding
from models import Member, Group, User
import pickle

router = APIRouter()


@router.get("/groups/{group_id}/members")
def get_members(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return {"status": "error", "message": "Group not found"}

    result = []
    for m in group.members:
        result.append({
            "id": m.id,
            "first_name": m.first_name,
            "last_name": m.last_name,
            "created_at": m.created_at.isoformat(),
        })
    return {"status": "success", "data": result}


@router.get("/members")
def get_user_members(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"status": "success", "data": []}

    result = []
    for m in user.members:
        result.append({
            "id": m.id,
            "first_name": m.first_name,
            "last_name": m.last_name,
        })
    return {"status": "success", "data": result}


@router.post("/groups/{group_id}/members")
async def add_member(
    group_id: int,
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"status": "error", "message": "User not found"}

    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return {"status": "error", "message": "Group not found"}

    # Check for duplicate name in group
    existing = db.query(Member).join(Member.groups).filter(
        Group.id == group_id,
        Member.first_name == first_name,
        Member.last_name == last_name,
    ).first()
    if existing:
        return {"status": "error", "message": f"{first_name} {last_name} already exists in this group"}

    image_bytes = await image.read()
    embedding, error = get_face_embedding(image_bytes)
    if error:
        return {"status": "error", "message": error}

    member = Member(
        first_name=first_name,
        last_name=last_name,
        owner_id=user.id,
        face_encoding=pickle.dumps([embedding]),
    )
    db.add(member)
    member.groups.append(group)
    db.commit()
    db.refresh(member)

    return {"status": "success", "data": {
        "id": member.id,
        "first_name": member.first_name,
        "last_name": member.last_name,
    }}


@router.post("/members/{member_id}/add-encoding")
async def add_encoding(member_id: int, image: UploadFile = File(...), db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        return {"status": "error", "message": "Member not found"}

    image_bytes = await image.read()
    embedding, error = get_face_embedding(image_bytes)
    if error:
        return {"status": "error", "message": error}

    if member.face_encoding:
        existing = pickle.loads(member.face_encoding)
        if isinstance(existing, list):
            existing.append(embedding)
        else:
            existing = [existing, embedding]
    else:
        existing = [embedding]

    member.face_encoding = pickle.dumps(existing)
    db.commit()

    return {"status": "success", "message": "Encoding added"}


@router.post("/groups/{group_id}/members/{member_id}/link")
def link_member_to_group(group_id: int, member_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    member = db.query(Member).filter(Member.id == member_id).first()
    if not group or not member:
        return {"status": "error", "message": "Not found"}

    if member not in group.members:
        group.members.append(member)
        db.commit()

    return {"status": "success", "message": f"{member.first_name} added to {group.name}"}


@router.delete("/members/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        return {"status": "error", "message": "Member not found"}
    db.delete(member)
    db.commit()
    return {"status": "success", "message": "Member deleted"}