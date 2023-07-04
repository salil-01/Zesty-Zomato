import json
import os
import uuid
import jwt
from dotenv import load_dotenv
from flask import Flask, request, jsonify,g

# Load environment variables from .env file
load_dotenv()
port = os.getenv("port")
secretKey = os.getenv("secretKey")

# Create Flask application
app = Flask(__name__)
app.config['SECRET_KEY'] = secretKey

# global variables to store user and food data
existing_data = []
food_items = []
orders = []
data_file_path = "./inventory.json"

# ----------- data loading from local system --------------
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

# load food data
def load_data():
    if not os.path.exists(data_file_path):
        return []

    try:
        with open(data_file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

# load orders
def load_orders():
    global orders
    try:
        with open("orders.json", "r") as file:
            data = json.load(file)
            orders = data
    except FileNotFoundError:
        orders = []

# save food data
def save_data(data):
    with open(data_file_path, 'w') as file:
        json.dump(data, file,indent=4)

# save orders
def save_orders():
    with open("orders.json", "w") as file:
        json.dump(orders, file,indent=4)


# initialize data on server run
def initialize_food_items():
    global food_items
    food_items = load_data()

initialize_food_items()


# generating jwt
def generate_jwt_token(user_id, email):
    payload = {
        'id': user_id,
        'email': email
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

# checking role before accessing protected routes (auth middleware)
def authenticate_and_authorize(role):
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Check if Authorization header is present
            if 'Authorization' not in request.headers:
                return jsonify({'message': 'Authorization required'}), 401

            # Get the token from the Authorization header
            token = request.headers['Authorization'].split()[1]

            try:
                # Verify and decode the token
                payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])

                # Check if the role matches the required role
                if payload['role'] != role:
                    return jsonify({'message': 'Unauthorized access'}), 403

                # Perform the protected action
                # using g module of flask to attach mail to request object
                g.user_email = payload["email"]
                return func(*args, **kwargs)

            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token'}), 401

        wrapper.__name__ = func.__name__
        return wrapper

    return decorator


# ------------------------ routes ----------------------
# user routes
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

# non protected routes
# menu route to show items avaialable to user
@app.route('/menu', methods=['GET'])
def get_menu():
    initialize_food_items()
    menu_items = [item for item in food_items if item['availability'] == 'Yes']
    return jsonify(menu_items)

# multiple order taking facility
@app.route('/place-order', methods=['POST'])
def place_order():
    # Get data from the request body
    user_email = g.user_email
    data = request.json
    order_items = data.get('items', [])
    load_orders()
    # Validate the order items
    if not isinstance(order_items, list) or len(order_items) == 0:
        return jsonify({'message': 'Invalid order items'}), 400

    total_price = 0

    # Process each order item
    for item in order_items:
        item_id = item.get('item_id')
        quantity = item.get('quantity')

        # Find the selected food item
        food_item = next((item for item in food_items if item['id'] == item_id), None)

        # Check if the food item exists
        if food_item is None:
            return jsonify({'message': 'Invalid food item ID'}), 400

        # Check if the food item is available
        if food_item['availability'] != 'Yes':
            return jsonify({'message': 'Food item is not available'}), 400

        # Check if the quantity is greater than the available stock
        if quantity > food_item['stock']:
            return jsonify({'message': 'Insufficient stock'}), 400

        # Calculate the total price for the current item
        item_price = food_item['price'] * quantity
        total_price += item_price

        # Update the stock of the food item
        food_item['stock'] -= quantity

    # Return the response with the total price
    order = {
        "order_id": len(orders) + 1,
        "customer": user_email,
        "total_price": total_price,
        "status": "Received"
    }
    orders.append(order)
    return jsonify({'message': 'Order placed successfully', 'total_price': total_price}), 200


# protected routes with admin access only 
# list of all the items avaialable in inventory
@app.route("/dish",methods=["GET"])
@authenticate_and_authorize("Admin")
def get_all_items():
    initialize_food_items()
    return jsonify(food_items), 200

# create a food item
@app.route("/dish",methods=["POST"])
@authenticate_and_authorize("Admin")
def create_dish():
    initialize_food_items()
    data = request.get_json()
    new_dish = {
        "id":len(food_items)+1,
        "name": data["name"],
         'price': data['price'],
        'availability': data['availability'],
        'stock': data['stock']
    }
    food_items.append(new_dish)
    # save updated data in file
    save_data(food_items)
    return jsonify({"msg":"Dish Created Successfully"})

# update dish
@app.route('/dish/<int:dish_id>', methods=['PATCH'])
@authenticate_and_authorize("Admin")
def update_dish(dish_id):
    initialize_food_items()()
    dish = find_dish_by_id(dish_id)

    if not dish:
        return jsonify({'message': 'Dish not found'}), 404

    data = request.get_json()

    dish['name'] = data.get('name', dish['name'])
    dish['price'] = data.get('price', dish['price'])
    dish['availability'] = data.get('availability', dish['availability'])

    # Reset stock to zero if availability is set to "No"
    if dish['availability'] == 'No':
        dish['stock'] = 0

    # Save the updated data to the JSON file
    save_data(food_items)

    return jsonify({'message': 'Dish updated successfully'}), 200

# all orders
@app.route("/orders", methods=["GET"])
@authenticate_and_authorize("Admin")
def display_orders():
   load_orders()
   return jsonify(orders),200



if __name__ == '__main__':
    app.run(port=port or 3000)
