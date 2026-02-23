from app.database import engine, Base
from models import User, Group, Member, Attendance

Base.metadata.create_all(bind=engine)
print("Tables created successfully!")