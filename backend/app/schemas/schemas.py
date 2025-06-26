### app/schemas/schemas.py
from pydantic import BaseModel
from typing import Optional, List, Dict
from uuid import UUID
from datetime import date

class UserLogin(BaseModel):
    username: str
    password: str

class TenantCreate(BaseModel):
    name: str

class TenantOut(BaseModel):
    id: UUID
    name: str
    class Config:
        orm_mode = True


class CloudAccountCreate(BaseModel):
    tenant_id: UUID
    provider: str
    account_identifier: str
    name: Optional[str] = None


class CloudAccountOut(BaseModel):
    id: UUID
    tenant_id: UUID
    provider: str
    account_identifier: str
    name: Optional[str]
    created_at: Optional[str]

    class Config:
        orm_mode = True

class DashboardCreate(BaseModel):
    tenant_id: UUID
    name: str
    folder_id: Optional[UUID] = None
    description: Optional[str] = None
    config: dict

class DashboardOut(BaseModel):
    id: UUID
    tenant_id: UUID
    name: str
    folder_id: Optional[UUID]
    description: Optional[str]
    config: dict
    created_at: Optional[str]
    class Config:
        orm_mode = True

class CostFilterParams(BaseModel):
    tenant_id: UUID
    provider: Optional[str] = None
    account_id: Optional[UUID] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    group_by: Optional[str] = None

class CostGroupResult(BaseModel):
    group: str
    total_cost: float


class BudgetCreate(BaseModel):
    tenant_id: UUID
    name: str
    period: str
    start_date: date
    end_date: date
    amount: float


class BudgetOut(BaseModel):
    id: UUID
    tenant_id: UUID
    name: str
    period: str
    start_date: date
    end_date: date
    amount: float
    created_at: Optional[str]

    class Config:
        orm_mode = True


class FolderCreate(BaseModel):
    tenant_id: UUID
    name: str


class FolderOut(BaseModel):
    id: UUID
    tenant_id: UUID
    name: str
    created_at: Optional[str]

    class Config:
        orm_mode = True


class SaasLicenseCreate(BaseModel):
    tenant_id: UUID
    name: str
    provider: str
    cost: Optional[float] = 0
    billing_cycle: Optional[str] = None
    users: Optional[int] = 0
    renewal_date: Optional[date] = None
    status: Optional[str] = None
    category: Optional[str] = None


class SaasLicenseOut(BaseModel):
    id: UUID
    tenant_id: UUID
    name: str
    provider: str
    cost: Optional[float]
    billing_cycle: Optional[str]
    users: Optional[int]
    renewal_date: Optional[date]
    status: Optional[str]
    category: Optional[str]
    created_at: Optional[str]

    class Config:
        orm_mode = True


class ChartCreate(BaseModel):
    tenant_id: UUID
    name: str
    chart_type: str
    fields: List[str]
    folder_id: Optional[UUID] = None


class ChartOut(BaseModel):
    id: UUID
    tenant_id: UUID
    name: str
    chart_type: str
    fields: List[str]
    folder_id: Optional[UUID]
    created_at: Optional[str]

    class Config:
        orm_mode = True