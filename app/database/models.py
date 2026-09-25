from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True) # allow null temporarily if old rows exist
    name = Column(String, nullable=True) # keep old column
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    role = Column(String, default='patient') # 'patient', 'doctor', or 'admin'
    is_active = Column(String, default='active') # 'active', 'suspended', 'banned'
    created_at = Column(DateTime, default=datetime.utcnow)