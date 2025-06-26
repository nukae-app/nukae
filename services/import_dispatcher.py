from app.importers.aws_cur_importer import aws_cur_import
from app.importers.gcp_bq_importer import gcp_bq_import
from app.importers.azure_cost_importer import azure_cost_import
from app.core.db import AsyncSessionLocal
from sqlalchemy import text
import asyncio

async def run_import_jobs():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text("SELECT id, type, provider, config FROM integrations"))
        integrations = result.fetchall()

        for row in integrations:
            tenant_id = str(row[0])
            integration_type = row[1]
            provider = row[2]
            config = row[3]

            try:
                if provider == 'aws' and integration_type == 's3_cur':
                    aws_cur_import(tenant_id, config, session.sync_session)
                elif provider == 'gcp' and integration_type == 'bq_export':
                    gcp_bq_import(tenant_id, config, session.sync_session)
                elif provider == 'azure' and integration_type == 'cost_api':
                    azure_cost_import(tenant_id, config, session.sync_session)
                else:
                    print(f"[⚠️] Unsupported integration: {provider} / {integration_type}")
            except Exception as e:
                print(f"[❌] Failed to import for tenant {tenant_id}: {e}")

if __name__ == '__main__':
    asyncio.run(run_import_jobs())
