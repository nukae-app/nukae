import csv
from io import StringIO
import boto3
from datetime import datetime


def assume_role_session(role_arn: str, external_id: str, region: str = "us-east-1"):
    sts = boto3.client("sts", region_name=region)
    response = sts.assume_role(
        RoleArn=role_arn,
        RoleSessionName="nukae-cur-import",
        ExternalId=external_id
    )
    creds = response['Credentials']
    return boto3.client(
        's3',
        aws_access_key_id=creds['AccessKeyId'],
        aws_secret_access_key=creds['SecretAccessKey'],
        aws_session_token=creds['SessionToken'],
        region_name=region
    )


def aws_cur_import(tenant_id: str, config: dict, db_session):
    s3 = assume_role_session(
        role_arn=config['role_arn'],
        external_id=config['external_id'],
        region=config.get('region', 'us-east-1')
    )

    bucket = config['bucket']
    key = config['key']  # path to the CUR CSV file
    response = s3.get_object(Bucket=bucket, Key=key)
    csv_content = response['Body'].read().decode('utf-8')

    reader = csv.DictReader(StringIO(csv_content))
    for row in reader:
        usage_date = row.get('lineItem/UsageStartDate', '').split('T')[0]
        cost = row.get('lineItem/UnblendedCost', '0')

        db_session.execute("""
            INSERT INTO cloud_usage_raw (
                tenant_id, provider, usage_date, service, cost, raw_data
            ) VALUES (
                :tenant_id, 'aws', :usage_date, :service, :cost, :raw_data
            )
        """, {
            'tenant_id': tenant_id,
            'usage_date': usage_date,
            'service': row.get('product/ProductName'),
            'cost': float(cost),
            'raw_data': row
        })