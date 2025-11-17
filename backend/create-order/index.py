'''
Business: Create order and send notification to Telegram
Args: event with POST data (name, email, phone, notes, items, total)
Returns: HTTP response with order_id
'''

import json
import os
import uuid
from typing import Dict, Any
import psycopg2
import requests


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
    
    customer_name = body_data.get('name')
    customer_email = body_data.get('email')
    customer_phone = body_data.get('phone')
    notes = body_data.get('notes', '')
    items = body_data.get('items', [])
    total_price = body_data.get('total', 0)
    
    if not all([customer_name, customer_email, customer_phone, items]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing required fields'}),
            'isBase64Encoded': False
        }
    
    order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    cursor.execute(
        """
        INSERT INTO t_p66010521_tour_booking_landing.orders 
        (order_id, customer_name, customer_email, customer_phone, notes, items, total_price, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (order_id, customer_name, customer_email, customer_phone, notes, json.dumps(items), total_price, 'pending')
    )
    
    conn.commit()
    cursor.close()
    conn.close()
    
    telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    telegram_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if telegram_token and telegram_chat_id:
        items_text = '\n'.join([f"• {item['title']} - ${item['price']}" for item in items])
        
        message = f"""
🎉 NEW ORDER: {order_id}

👤 Customer:
Name: {customer_name}
Email: {customer_email}
Phone: {customer_phone}

📦 Items:
{items_text}

💰 Total: ${total_price}

📝 Notes: {notes if notes else 'None'}

To confirm payment, send:
/confirm {order_id}
"""
        
        try:
            requests.post(
                f'https://api.telegram.org/bot{telegram_token}/sendMessage',
                json={
                    'chat_id': telegram_chat_id,
                    'text': message,
                    'parse_mode': 'HTML'
                },
                timeout=5
            )
        except Exception as e:
            print(f"Telegram notification failed: {e}")
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'order_id': order_id, 'status': 'pending'}),
        'isBase64Encoded': False
    }
