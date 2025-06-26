### app/models/models.py
from sqlalchemy import Column, String, Date, DateTime, Numeric, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

class Dashboard(Base):
    __tablename__ = "dashboards"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    folder_id = Column(UUID(as_uuid=True), nullable=True)
    description = Column(String)
    config = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=func.now())

class FocusCost(Base):
    __tablename__ = "finops_focus_cost_data"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    provider = Column(String, nullable=False)
    cost_date = Column(Date, nullable=False)
    service = Column(String)
    resource_id = Column(String)
    environment = Column(String)
    product_family = Column(String)
    usage_type = Column(String)
    unit = Column(String)
    quantity = Column(Numeric)
    cost = Column(Numeric)
    currency = Column(String, default='USD')
    tags = Column(JSON)
    generated_at = Column(DateTime, default=func.now())
