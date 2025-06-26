### app/services/dashboard.py
### app/services/dashboard.py
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import SessionLocal
from app.schemas.schemas import (
    UserLogin, TenantCreate, DashboardCreate, CostFilterParams,
    FolderCreate, SaasLicenseCreate, ChartCreate
)
from app.models.models import (
    Tenant, Dashboard, FocusCost, DashFolder,
    SaasLicense, Chart
)
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


def create_folder(folder: FolderCreate, db: Session):
    db_folder = DashFolder(**folder.dict())
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder


def get_folders(db: Session):
    return db.query(DashFolder).all()


def get_folders_and_dashboards(db: Session):
    folders = {str(f.id): {
        "id": str(f.id),
        "name": f.name,
        "type": "folder",
        "icon": "lucide:folder",
        "children": []
    } for f in db.query(DashFolder).all()}
    dashboards = db.query(Dashboard).all()
    result = []
    for d in dashboards:
        item = {
            "id": str(d.id),
            "name": d.name,
            "type": "dashboard",
            "icon": "lucide:bar-chart-2"
        }
        if d.folder_id and str(d.folder_id) in folders:
            folders[str(d.folder_id)]["children"].append(item)
        else:
            result.append(item)
    result.extend(folders.values())
    return result


def create_saas_license(license: SaasLicenseCreate, db: Session):
    db_license = SaasLicense(**license.dict())
    db.add(db_license)
    db.commit()
    db.refresh(db_license)
    return db_license


def get_saas_licenses(db: Session):
    return db.query(SaasLicense).all()


def create_chart(chart: ChartCreate, db: Session):
    db_chart = Chart(**chart.dict())
    db.add(db_chart)
    db.commit()
    db.refresh(db_chart)
    return db_chart


def get_charts(db: Session):
    return db.query(Chart).all()


def get_dashboard_data(db: Session):
    total_cost = db.query(func.coalesce(func.sum(FocusCost.cost), 0)).scalar() or 0
    top_query = (
        db.query(FocusCost.service, func.sum(FocusCost.cost).label("c"))
        .group_by(FocusCost.service)
        .order_by(func.sum(FocusCost.cost).desc())
        .limit(5)
        .all()
    )
    top_services = [{"name": svc or "Unknown", "cost": float(cost)} for svc, cost in top_query]
    licenses = db.query(SaasLicense).all()
    saas = [{"application": l.name, "users": l.users, "cost": float(l.cost or 0)} for l in licenses]
    return {
        "totalCost": float(total_cost),
        "estimatedSavings": 0,
        "topServices": top_services,
        "saasLicenses": saas
    }