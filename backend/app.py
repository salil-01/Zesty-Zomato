import json
import os
import uuid
import jwt
from dotenv import load_dotenv
from flask import Flask, request, jsonify

# Load environment variables from .env file
load_dotenv()
port = os.getenv("port")
secretKey = os.getenv("secretKey")

# Create Flask application
app = Flask(__name__)
app.config['SECRET_KEY'] = secretKey

existing_data = []

# reading user data
def read_user_data():
    try:
        with open('users.json', 'r') as file:
            existing_data = json.load(file)
    except FileNotFoundError:
        existing_data = []

    return existing_data

# saving user data
def save_user_data(user_data):
    existing_data = read_user_data()
    existing_data.append(user_data)

    with open('users.json', 'w') as file:
        json.dump(existing_data, file, indent=4)

# checking if user already registered
def is_user_registered(email):
    existing_data = read_user_data()
    for user in existing_data:
        if user['email'] == email:
            return True

    return False


# generating jwt
def generate_jwt_token(user_id, email):
    payload = {
        'id': user_id,
        'email': email
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

# checking role before accessing protected routes
def authenticate_token(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Missing token'}), 401

        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            role = payload.get('role')

            if role != 'admin':
                return jsonify({'message': 'Unauthorized access'}), 403

            # Additional checks or validations based on the role can be performed here

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401

        return func(*args, **kwargs)

    return decorated_function

# routes
@app.route('/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    role = request.json.get('role')

    if is_user_registered(email):
        return jsonify({'message': 'User already exists'}), 400

    user_id = str(uuid.uuid4())  # Generate a unique ID
    user_data = {
        'id': user_id,
        'email': email,
        'password': password,
        'role': role
    }

    save_user_data(user_data)

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    existing_data = read_user_data()
    for user in existing_data:
        if user['email'] == email and user['password'] == password:
            user_id = user['id']
            token = generate_jwt_token(user_id, email)
            return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(port=port or 3000)
