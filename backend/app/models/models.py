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


class CloudAccount(Base):
    __tablename__ = "cloud_accounts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    provider = Column(String, nullable=False)
    account_identifier = Column(String, nullable=False)
    name = Column(String)
    created_at = Column(DateTime, default=func.now())


class CloudResource(Base):
    __tablename__ = "cloud_resources"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    provider = Column(String, nullable=False)
    service = Column(String, nullable=False)
    region = Column(String)
    resource_id = Column(String, nullable=False)
    resource_name = Column(String)
    resource_type = Column(String)
    tags = Column(JSON)
    created_at = Column(DateTime, default=func.now())


class CloudUsageRaw(Base):
    __tablename__ = "cloud_usage_raw"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    provider = Column(String, nullable=False)
    usage_date = Column(Date, nullable=False)
    billing_period_start = Column(Date)
    billing_period_end = Column(Date)
    account_id = Column(UUID(as_uuid=True), ForeignKey("cloud_accounts.id"))
    service = Column(String)
    resource_id = Column(String)
    resource_type = Column(String)
    usage_type = Column(String)
    operation = Column(String)
    usage_quantity = Column(Numeric)
    usage_unit = Column(String)
    cost = Column(Numeric)
    amortized_cost = Column(Numeric)
    currency = Column(String, default='USD')
    tags = Column(JSON)
    raw_data = Column(JSON)
    imported_at = Column(DateTime, default=func.now())


class CloudCost(Base):
    __tablename__ = "cloud_costs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    provider = Column(String, nullable=False)
    account_id = Column(UUID(as_uuid=True), ForeignKey("cloud_accounts.id"))
    resource_id = Column(String)
    service = Column(String)
    usage_date = Column(Date, nullable=False)
    cost = Column(Numeric, nullable=False)
    currency = Column(String, default='USD')


class CloudMetric(Base):
    __tablename__ = "cloud_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    provider = Column(String)
    resource_id = Column(String)
    metric_name = Column(String)
    metric_value = Column(Numeric)
    measured_at = Column(DateTime, default=func.now())

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
    account_id = Column(UUID(as_uuid=True), ForeignKey("cloud_accounts.id"))
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


class KubernetesCluster(Base):
    __tablename__ = "kubernetes_clusters"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    region = Column(String)
    created_at = Column(DateTime, default=func.now())


class KubernetesUsage(Base):
    __tablename__ = "kubernetes_usage"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cluster_id = Column(UUID(as_uuid=True), ForeignKey("kubernetes_clusters.id", ondelete="CASCADE"))
    namespace = Column(String)
    resource_name = Column(String)
    resource_type = Column(String)
    usage_date = Column(Date, nullable=False)
    cpu_request = Column(Numeric)
    cpu_usage = Column(Numeric)
    memory_request = Column(Numeric)
    memory_usage = Column(Numeric)
    cost = Column(Numeric)
    currency = Column(String, default='USD')
    created_at = Column(DateTime, default=func.now())


class SoftwareProduct(Base):
    __tablename__ = "software_products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    vendor = Column(String)


class SoftwareLicense(Base):
    __tablename__ = "software_licenses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("software_products.id"))
    license_type = Column(String)
    quantity = Column(Numeric)
    start_date = Column(Date)
    end_date = Column(Date)
    cost = Column(Numeric)
    currency = Column(String, default='USD')
    created_at = Column(DateTime, default=func.now())


class Budget(Base):
    __tablename__ = "budgets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    period = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    amount = Column(Numeric, nullable=False)
    created_at = Column(DateTime, default=func.now())


class BudgetItem(Base):
    __tablename__ = "budget_items"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    budget_id = Column(UUID(as_uuid=True), ForeignKey("budgets.id", ondelete="CASCADE"))
    provider = Column(String)
    service = Column(String)
    product_id = Column(UUID(as_uuid=True), ForeignKey("software_products.id"))
    target_amount = Column(Numeric)
    created_at = Column(DateTime, default=func.now())


class BudgetAlert(Base):
    __tablename__ = "budget_alerts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    budget_id = Column(UUID(as_uuid=True), ForeignKey("budgets.id", ondelete="CASCADE"))
    threshold_percent = Column(Numeric, nullable=False)
    alert_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())


class DashFolder(Base):
    __tablename__ = "dash_folders"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())


class Chart(Base):
    __tablename__ = "charts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    chart_type = Column(String, nullable=False)
    fields = Column(JSON, nullable=False)
    folder_id = Column(UUID(as_uuid=True), ForeignKey("dash_folders.id", ondelete="SET NULL"))
    created_at = Column(DateTime, default=func.now())


class SaasLicense(Base):
    __tablename__ = "saas_licenses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    cost = Column(Numeric)
    billing_cycle = Column(String)
    users = Column(Numeric)
    renewal_date = Column(Date)
    status = Column(String)
    category = Column(String)
    created_at = Column(DateTime, default=func.now())