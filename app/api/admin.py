from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional

from app.database.database import get_db
from app.database.models import User
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis
from app.api.auth import get_current_admin

router = APIRouter()


@router.get("/users")
def list_all_users(
    search: Optional[str] = None,
    role: Optional[str] = None,
    status_filter: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """List all users with search, role filter, status filter, and pagination."""
    query = db.query(User)

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                User.username.ilike(term),
                User.email.ilike(term),
                User.name.ilike(term)
            )
        )

    if role and role != "all":
        query = query.filter(User.role == role)

    if status_filter and status_filter != "all":
        query = query.filter(User.is_active == status_filter)

    total = query.count()
    offset = (page - 1) * limit
    users = query.order_by(User.id.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "users": [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "name": u.name,
                "role": u.role,
                "is_active": getattr(u, "is_active", "active"),
                "created_at": str(getattr(u, "created_at", "N/A")),
            }
            for u in users
        ]
    }
