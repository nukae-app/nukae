### app/services/dashboard.py
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import SessionLocal
from app.schemas.schemas import UserLogin, TenantCreate, DashboardCreate, CostFilterParams
from app.models.models import Tenant, Dashboard, FocusCost
from typing import List

users = {"admin": "admin"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def login_user(user: UserLogin):
    if users.get(user.username) == user.password:
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

def create_tenant(tenant: TenantCreate, db: Session):
    db_tenant = Tenant(name=tenant.name)
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant

def get_tenants(db: Session):
    return db.query(Tenant).all()

def create_dashboard(dashboard: DashboardCreate, db: Session):
    db_dashboard = Dashboard(**dashboard.dict())
    db.add(db_dashboard)
    db.commit()
    db.refresh(db_dashboard)
    return db_dashboard

def get_dashboards(db: Session):
    return db.query(Dashboard).all()

def get_costs_by_group(filter: CostFilterParams, db: Session):
    query = db.query(
        getattr(FocusCost, filter.group_by).label("group"),
        func.sum(FocusCost.cost).label("total_cost")
    ).filter(FocusCost.tenant_id == filter.tenant_id)

    if filter.provider:
        query = query.filter(FocusCost.provider == filter.provider)
    if filter.start_date and filter.end_date:
        query = query.filter(FocusCost.cost_date.between(filter.start_date, filter.end_date))

    query = query.group_by(getattr(FocusCost, filter.group_by))
    return query.all()