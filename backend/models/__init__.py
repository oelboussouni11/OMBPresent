from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, LargeBinary, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    groups = relationship("Group", back_populates="owner")


class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="groups")
    members = relationship("Member", back_populates="group")


class Member(Base):
    __tablename__ = "members"
    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    group_id = Column(Integer, ForeignKey("groups.id"))
    face_encoding = Column(LargeBinary)
    created_at = Column(DateTime, default=datetime.utcnow)
    group = relationship("Group", back_populates="members")
    attendances = relationship("Attendance", back_populates="member")


class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    group_id = Column(Integer, ForeignKey("groups.id"))
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    member = relationship("Member", back_populates="attendances")