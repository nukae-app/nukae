### app/api/routes.py
from fastapi import APIRouter, Depends
from typing import List

from app.schemas.schemas import (
    UserLogin, TenantCreate, DashboardCreate,
    TenantOut, DashboardOut, CostFilterParams, CostGroupResult,
    FolderCreate, FolderOut, SaasLicenseCreate, SaasLicenseOut,
    ChartCreate, ChartOut
)
from app.services.dashboard import (
    login_user, create_tenant, get_tenants,
    get_dashboards, create_dashboard, get_costs_by_group, get_db,
    create_folder, get_folders, get_folders_and_dashboards,
    create_saas_license, get_saas_licenses,
    create_chart, get_charts, get_dashboard_data
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


@router.get("/dashboard")
def dashboard_summary(db: Session = Depends(get_db)):
    return get_dashboard_data(db)


@router.get("/folders", response_model=List[FolderOut])
def folders(db: Session = Depends(get_db)):
    return get_folders(db)


@router.post("/folders", response_model=FolderOut)
def new_folder(folder: FolderCreate, db: Session = Depends(get_db)):
    return create_folder(folder, db)


@router.get("/folders-and-dashboards")
def folders_and_dashboards(db: Session = Depends(get_db)):
    return get_folders_and_dashboards(db)


@router.get("/saas-licenses", response_model=List[SaasLicenseOut])
def saas_licenses(db: Session = Depends(get_db)):
    return get_saas_licenses(db)


@router.post("/saas-licenses", response_model=SaasLicenseOut)
def new_saas_license(license: SaasLicenseCreate, db: Session = Depends(get_db)):
    return create_saas_license(license, db)


@router.get("/charts", response_model=List[ChartOut])
def charts(db: Session = Depends(get_db)):
    return get_charts(db)


@router.post("/charts", response_model=ChartOut)
def new_chart(chart: ChartCreate, db: Session = Depends(get_db)):
    return create_chart(chart, db)