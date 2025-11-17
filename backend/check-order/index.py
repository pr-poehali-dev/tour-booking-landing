'''
Business: Check order status and payment confirmation
Args: event with GET query parameter order_id
Returns: HTTP response with order status
'''

import json
import os
from typing import Dict, Any
import psycopg2


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters', {})
    order_id = query_params.get('order_id')
    
    if not order_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing order_id parameter'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    cursor.execute(
        """
        SELECT order_id, status, payment_confirmed, total_price, customer_name
        FROM t_p66010521_tour_booking_landing.orders
        WHERE order_id = %s
        """,
        (order_id,)
    )
    
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not result:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Order not found'}),
            'isBase64Encoded': False
        }
    
    order_data = {
        'order_id': result[0],
        'status': result[1],
        'payment_confirmed': result[2],
        'total_price': float(result[3]),
        'customer_name': result[4]
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(order_data),
        'isBase64Encoded': False
    }
