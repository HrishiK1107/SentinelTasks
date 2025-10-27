import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('TASKS_TABLE')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        task_id = event['pathParameters']['id']
        body = json.loads(event['body'])
        is_completed = body.get('is_completed')

        if is_completed is None:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': "'is_completed' is required"})
            }

        response = table.update_item(
            Key={'id': task_id},
            UpdateExpression='SET is_completed = :val',
            ExpressionAttributeValues={':val': is_completed},
            ReturnValues='UPDATED_NEW'
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
            },
            'body': json.dumps({'status': 'success', 'updated_attributes': response['Attributes']})
        }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Could not update the task'})
        }