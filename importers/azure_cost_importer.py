from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.cloud import bigquery
import json

SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

def get_gcp_credentials(config):
    creds = Credentials.from_authorized_user_info(info=config['oauth'])
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
    return creds

def gcp_bq_import(tenant_id: str, config: dict, db_session):
    creds = get_gcp_credentials(config)
    client = bigquery.Client(credentials=creds, project=config['project_id'])

    query = f"""
        SELECT *
        FROM `{config['project_id']}.{config['dataset']}.{config['table']}`
        WHERE usage_start_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    """
    rows = client.query(query).result()

    for row in rows:
        db_session.execute("""
            INSERT INTO cloud_usage_raw (
                tenant_id, provider, usage_date, service, cost, raw_data
            ) VALUES (
                :tenant_id, 'gcp', :usage_date, :service, :cost, :raw_data
            )
        """, {
            'tenant_id': tenant_id,
            'usage_date': row.usage_start_time.date(),
            'service': row.service_description,
            'cost': float(row.cost),
            'raw_data': dict(row)
        })