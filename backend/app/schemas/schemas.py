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
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    group_by: Optional[str] = None

class CostGroupResult(BaseModel):
    group: str
    total_cost: float
