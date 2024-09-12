from flask import Flask, send_from_directory
from flask_socketio import SocketIO, emit
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return send_from_directory('', 'index.html')

@socketio.on('message')
def handle_message(message):
    logger.info(f'Received message: {message}')
    emit('message', message, broadcast=True)
    logger.info(f'Sent message: {message}')

if __name__ == '__main__':
    logger.info('Starting server...')
    socketio.run(app, host='0.0.0.0', port=5000)
