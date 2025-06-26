### app/api/routes.py
from fastapi import APIRouter, Depends
from typing import List

from app.schemas.schemas import (
    UserLogin, TenantCreate, DashboardCreate,
    TenantOut, DashboardOut, CostFilterParams, CostGroupResult
)
from app.services.dashboard import (
    login_user, create_tenant, get_tenants,
    get_dashboards, create_dashboard, get_costs_by_group, get_db
)
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/login")
def login(user: UserLogin):
    return login_user(user)

@router.post("/tenants", response_model=TenantOut)
def new_tenant(tenant: TenantCreate, db: Session = Depends(get_db)):
    return create_tenant(tenant, db)

@router.get("/tenants", response_model=List[TenantOut])
def tenants(db: Session = Depends(get_db)):
    return get_tenants(db)

@router.get("/dashboards", response_model=List[DashboardOut])
def dashboards(db: Session = Depends(get_db)):
    return get_dashboards(db)

@router.post("/dashboards", response_model=DashboardOut)
def new_dashboard(dashboard: DashboardCreate, db: Session = Depends(get_db)):
    return create_dashboard(dashboard, db)

@router.post("/costs", response_model=List[CostGroupResult])
def costs_by_group(filter: CostFilterParams, db: Session = Depends(get_db)):
    return get_costs_by_group(filter, db)