from azure.identity import ClientSecretCredential
from azure.mgmt.costmanagement import CostManagementClient

def get_azure_credentials(config):
    credential = ClientSecretCredential(
        tenant_id=config['tenant_id'],
        client_id=config['client_id'],
        client_secret=config['client_secret']
    )
    return credential

def azure_cost_import(tenant_id: str, config: dict, db_session):
    credential = get_azure_credentials(config)
    client = CostManagementClient(credential)

    scope = config['scope']  # e.g. "/subscriptions/<sub_id>"
    query = client.query.usage(scope, parameters={
        'type': 'Usage',
        'timeframe': 'MonthToDate',
    })

    for row in query.rows:
        service = row[2] if len(row) > 2 else 'unknown'
        cost = float(row[4]) if len(row) > 4 else 0.0

        db_session.execute("""
            INSERT INTO cloud_usage_raw (
                tenant_id, provider, usage_date, service, cost, raw_data
            ) VALUES (
                :tenant_id, 'azure', CURRENT_DATE, :service, :cost, :raw_data
            )
        """, {
            'tenant_id': tenant_id,
            'service': service,
            'cost': cost,
            'raw_data': row
        })