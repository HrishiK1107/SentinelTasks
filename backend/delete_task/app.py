import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TASKS_TABLE')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        task_id = event['pathParameters']['id']

        table.delete_item(
            Key={'id': task_id}
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
            },
            'body': json.dumps({'status': 'success', 'message': f'Task {task_id} deleted'})
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not delete the task'})
        }