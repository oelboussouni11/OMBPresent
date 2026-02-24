from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from models import Group, User
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    user_email: str


@router.post("/groups")
def create_group(data: GroupCreate, db: Session = Depends(get_db)):
    # Get or create user
    user = db.query(User).filter(User.email == data.user_email).first()
    if not user:
        user = User(email=data.user_email, name=data.user_email.split("@")[0])
        db.add(user)
        db.commit()
        db.refresh(user)

    group = Group(name=data.name, description=data.description, owner_id=user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    return {"status": "success", "data": {
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "member_count": 0,
    }}


@router.get("/groups")
def get_groups(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"status": "success", "data": []}

    groups = db.query(Group).filter(Group.owner_id == user.id).all()
    result = []
    for g in groups:
        result.append({
            "id": g.id,
            "name": g.name,
            "description": g.description,
            "member_count": len(g.members),
        })

    return {"status": "success", "data": result}


@router.delete("/groups/{group_id}")
def delete_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return {"status": "error", "message": "Group not found"}
    db.delete(group)
    db.commit()
    return {"status": "success", "message": "Group deleted"}