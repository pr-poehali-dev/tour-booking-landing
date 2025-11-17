'''
Business: Confirm payment for order (called by Telegram bot webhook)
Args: event with POST data (order_id, confirmation_message)
Returns: HTTP response with success status
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    order_id = body_data.get('order_id')
    confirmation_message = body_data.get('confirmation_message', 'Payment confirmed')
    
    if not order_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing order_id'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    cursor.execute(
        """
        UPDATE t_p66010521_tour_booking_landing.orders
        SET payment_confirmed = TRUE, status = 'confirmed', updated_at = CURRENT_TIMESTAMP
        WHERE order_id = %s
        RETURNING order_id
        """,
        (order_id,)
    )
    
    result = cursor.fetchone()
    conn.commit()
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
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'order_id': order_id,
            'message': confirmation_message
        }),
        'isBase64Encoded': False
    }
