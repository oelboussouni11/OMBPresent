from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from pydantic import BaseModel
from typing import Optional
from models import Group, User, Attendance, Member
from datetime import datetime, date, timedelta

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

@router.get("/groups/{group_id}/stats")
def get_group_stats(group_id: int, db: Session = Depends(get_db)):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        return {"status": "error", "message": "Group not found"}

    total_members = len(group.members)
    today_start = datetime.combine(date.today(), datetime.min.time())

    # Today's attendance
    today_records = db.query(Attendance).filter(
        Attendance.group_id == group_id,
        Attendance.timestamp >= today_start,
    ).all()
    present_today = len(today_records)

    # Last 7 days attendance
    week_ago = today_start - timedelta(days=7)
    week_records = db.query(Attendance).filter(
        Attendance.group_id == group_id,
        Attendance.timestamp >= week_ago,
    ).all()

    # Daily breakdown
    daily = {}
    for r in week_records:
        day = r.timestamp.strftime("%a")
        if day not in daily:
            daily[day] = 0
        daily[day] += 1

    # Average attendance rate
    days_with_data = len(daily) if daily else 1
    avg_rate = round((sum(daily.values()) / (days_with_data * max(total_members, 1))) * 100, 1)

    # Recent attendance
    recent = []
    for r in sorted(today_records, key=lambda x: x.timestamp, reverse=True)[:5]:
        member = db.query(Member).filter(Member.id == r.member_id).first()
        recent.append({
            "name": f"{member.first_name} {member.last_name}" if member else "Unknown",
            "time": r.timestamp.strftime("%I:%M %p"),
            "confidence": r.confidence,
        })

    return {"status": "success", "data": {
        "total_members": total_members,
        "present_today": present_today,
        "absent_today": max(total_members - present_today, 0),
        "avg_rate": avg_rate,
        "daily": daily,
        "recent": recent,
        "group_name": group.name,
        "group_description": group.description,
    }}