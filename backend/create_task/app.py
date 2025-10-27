import json
import boto3
import uuid
import os
from datetime import datetime

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TASKS_TABLE')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        task_text = body.get('task_text')

        if not task_text:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'task_text is required'})
            }

        item = {
            'id': str(uuid.uuid4()),
            'task_text': task_text,
            'is_completed': False,
            'created_at': datetime.utcnow().isoformat()
        }

        table.put_item(Item=item)

        return {
            'statusCode': 201,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
            },
            'body': json.dumps(item)
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not create the task'})
        }