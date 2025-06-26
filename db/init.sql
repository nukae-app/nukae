-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tenants (organizations)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT now()
);

-- Integrations
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g. 'aws', 'gcp', 'azure'
    config JSONB NOT NULL,
    connected_at TIMESTAMP DEFAULT now()
);

-- Cloud resources (discovered inventory)
CREATE TABLE cloud_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'aws', 'gcp', 'azure'
    service TEXT NOT NULL,
    region TEXT,
    resource_id TEXT NOT NULL,
    resource_name TEXT,
    resource_type TEXT,
    tags JSONB,
    created_at TIMESTAMP DEFAULT now()
);

-- Cloud usage (raw data from CUR/Billing Export)
CREATE TABLE cloud_usage_raw (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    usage_date DATE NOT NULL,
    billing_period_start DATE,
    billing_period_end DATE,
    account_id TEXT,
    service TEXT,
    resource_id TEXT,
    resource_type TEXT,
    usage_type TEXT,
    operation TEXT,
    usage_quantity NUMERIC,
    usage_unit TEXT,
    cost NUMERIC,
    amortized_cost NUMERIC,
    currency TEXT DEFAULT 'USD',
    tags JSONB,
    raw_data JSONB,
    imported_at TIMESTAMP DEFAULT now()
);

-- Cloud cost summaries
CREATE TABLE cloud_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    resource_id TEXT,
    service TEXT,
    usage_date DATE NOT NULL,
    cost NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD'
);

-- Cloud metrics (RAM, CPU, etc)
CREATE TABLE cloud_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    provider TEXT,
    resource_id TEXT,
    metric_name TEXT,
    metric_value NUMERIC,
    measured_at TIMESTAMP DEFAULT now()
);

-- FOCUS-normalized cost data (conforming to FinOps Foundation spec)
CREATE TABLE finops_focus_cost_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    cost_date DATE NOT NULL,
    service TEXT,
    resource_id TEXT,
    environment TEXT, -- e.g. 'dev', 'prod'
    product_family TEXT,
    usage_type TEXT,
    unit TEXT,
    quantity NUMERIC,
    cost NUMERIC,
    currency TEXT DEFAULT 'USD',
    tags JSONB,
    generated_at TIMESTAMP DEFAULT now()
);

-- Carpetas de dashboards por tenant
CREATE TABLE dash_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Dashboards personalizados
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES dash_folders(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    config JSONB NOT NULL,  -- definición del layout, widgets, filtros
    created_at TIMESTAMP DEFAULT now()
);

-- Índices para rendimiento
CREATE INDEX idx_dashboards_tenant ON dashboards(tenant_id);
CREATE INDEX idx_dashboards_folder ON dashboards(folder_id);

-- Indexes for performance
CREATE INDEX idx_usage_date ON cloud_usage_raw(usage_date);
CREATE INDEX idx_costs_date ON cloud_costs(usage_date);
CREATE INDEX idx_metrics_measured ON cloud_metrics(measured_at);
CREATE INDEX idx_focus_date ON finops_focus_cost_data(cost_date);

-- End of schema