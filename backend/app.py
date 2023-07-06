import json
import os
import uuid
import jwt
from dotenv import load_dotenv
from flask import Flask, request, jsonify,g
from flask_cors import CORS
import openai
import mysql.connector

# Load environment variables from .env file
load_dotenv()
port = os.getenv("port")
secretKey = os.getenv("secretKey")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
username = os.getenv("username")
password = os.getenv("password")
databasename = os.getenv("databasename")


# Create Flask application
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = secretKey
app.config['OPENAI_API_KEY'] = OPENAI_API_KEY
app.config['MYSQL_HOST'] = "localhost"
app.config['MYSQL_USER'] = username
# app.config['MYSQL_PASSWORD'] = password
app.config['MYSQL_DB'] = databasename

# mysql connection
try:
    connection = mysql.connector.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        # password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB']
    )
    if connection.is_connected():
        print("Connected to MYSQL")
except mysql.connector.Error as e:
    print(f"Error Connecting to MYSQL {e}")


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
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %(email)s", {'email': email})
    count = cursor.fetchone()[0]

    cursor.close()
    connection.close()

    return count > 0

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

# find dish by id
def find_dish_by_id(id):
    for item in food_items:
        if (item["id"]==id):
            return item

# find order by id
def find_order_by_id(id):
    for item in orders:
        if (item["order_id"]==id):
            return item


# generating jwt
def generate_jwt_token(role, email,id):
    payload = {
        'role': role,
        'email': email,
        "id":id
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
                g.user_id = payload["id"]
                print(payload["id"])
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

    # if is_user_registered(email):
    #     return jsonify({'message': 'User already exists'}), 400

    # connection = get_mysql_connection()
    cursor = connection.cursor()

    query = "INSERT INTO users ( email, password, role) VALUES (%s, %s, %s)"
    values = ( email, password, role)
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    # connecting with db
    cursor = connection.cursor()
    query = "SELECT * FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    user_data = cursor.fetchone()
    cursor.close()

    if user_data is not None and user_data[2] == password:
        role = user_data[3]
        id = user_data[0]
        token = generate_jwt_token(role, email,id)
        return jsonify({'token': token, 'role': role, 'email': email}), 200

    return jsonify({'message': 'Invalid credentials'}), 401
# non protected routes

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("user_message")  # Get the user's message from the request
    # print(user_message)
    openai_api_key = app.config['OPENAI_API_KEY']  # Get the OpenAI API key from the app config

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Welcome to the Food App Assistant! How can I assist you with your food-related queries?"},
            {"role": "user", "content": user_message}
        ],
        api_key=openai_api_key
    )

    # Get the response from OpenAI
    bot_response = response.choices[0].message.content

    # Return the bot's response to the client
    return jsonify({'response': bot_response})
    # return jsonify({"res":"Ok"})


# # menu route to show items avaialable to everyone
@app.route('/menu', methods=['GET'])
def get_menu():
    # initialize_food_items()
    # menu_items = [item for item in food_items if item['availability'] == 'Yes']

    # mysql
    cursor = connection.cursor()
    query = "SELECT * FROM dishes WHERE availability = 'Yes'"
    cursor.execute(query)
    menu_items = []
    for item in cursor.fetchall():
        dish = {
            "id": item[0],
            "name": item[1],
            "price": item[2],
            "availability": item[3],
            "stock": item[4]
        }
        menu_items.append(dish)
    cursor.close()
    return jsonify(menu_items)

# multiple order taking facility
@app.route('/place-order', methods=['POST'])
@authenticate_and_authorize("User")
def place_order():
    # Get data from the request body
    # user_email = g.user_email
    # data = request.json
    # order_items = data.get('items', {})
    # print(order_items)
    # load_data()
    # load_orders()
    
    # # Validate the order items
    # # if not isinstance(order_items, dict) or len(order_items) == 0:
    # #     return jsonify({'message': 'Invalid order items'}), 400

    # total_price = 0
    # order_items_dict = {}

    # # Process each order item
    # for item_id, quantity in order_items():
    #     # Find the selected food item
    #     food_item = next((item for item in food_items if item['id'] == item_id), None)

    #     # Check if the food item exists
    #     if food_item is None:
    #         return jsonify({'message': 'Invalid food item ID'}), 400

    #     # Check if the food item is available
    #     if food_item['availability'] != 'Yes':
    #         return jsonify({'message': 'Food item is not available'}), 400

    #     # Check if the quantity is greater than the available stock
    #     if quantity > food_item['stock']:
    #         return jsonify({'message': 'Insufficient stock'}), 400

    #     # Calculate the total price for the current item
    #     item_price = food_item['price'] * quantity
    #     total_price += item_price

    #     # Update the stock of the food item
    #     food_item['stock'] -= quantity
        
    #     # Add the quantity to the order item dictionary
    #     order_items_dict[item_id] = quantity

    # # Convert the order_items_dict to a list of items
    # order_items_list = [{'item_id': item_id, 'quantity': quantity} for item_id, quantity in order_items_dict.items()]
    
    # # Return the response with the total price
    # order = {
    #     "order_id": str(uuid.uuid4()),
    #     "customer": user_email,
    #     "total_price": total_price,
    #     "status": "Received",
    #     "items": order_items_list
    # }
    # orders.append(order)
    # save_orders()
    # save_data(food_items)

    # mysql
   # Get data from the request body
    user_email = g.user_email
    user_id = int(g.user_id)
    data = request.json
    item_id = int(data.get('id'))
    quantity = int(data.get('quantity'))
    
    # Validate the order data
    if not item_id or not quantity:
        return jsonify({'message': 'Invalid order data'}), 400
    
     # Find the selected food item
    cursor = connection.cursor()
    select_query = "SELECT * FROM dishes WHERE id = %s"
    cursor.execute(select_query, (item_id,))
    food_item = cursor.fetchone()
    # print(food_item)
    if food_item is None:
        cursor.close()
        return jsonify({'message': 'Invalid food item ID'}), 400
    
    # Check if the food item is available
    if food_item[3] != 'Yes':
        cursor.close()
        return jsonify({'message': 'Food item is not available'}), 400

    # Check if the quantity is greater than the available stock
    
    if quantity > food_item[4]:
        cursor.close()
        return jsonify({'message': 'Insufficient stock'}), 400

    # Calculate the total price for the current item
    total_price = food_item[2] * quantity

    # Update the stock of the food item
    new_stock = food_item[4] - quantity
    update_query = "UPDATE dishes SET stock = %s, availability = %s WHERE id = %s"
    update_values = (new_stock, 'No' if new_stock == 0 else 'Yes', item_id)
    cursor.execute(update_query, update_values)
    connection.commit()

    # Insert the order into the orders table
    rating = 0
    insert_query = "INSERT INTO orders (email, total_price, status, user_id,item_id,rating) VALUES (%s, %s, %s,%s,%s,%s)"
    insert_values = (user_email, total_price, 'Received', user_id,item_id,rating)
    print(insert_values)
    cursor.execute(insert_query, insert_values)
    connection.commit()
    cursor.close()
    
    return jsonify({'message': 'Order placed successfully', 'total_price': total_price}), 200

# def place_order():
#     # Get data from the request body
#     user_email = g.user_email
#     data = request.json
#     order_items = data.get('items', [])
#     load_orders()
#     # Validate the order items
#     if not isinstance(order_items, list) or len(order_items) == 0:
#         return jsonify({'message': 'Invalid order items'}), 400

#     total_price = 0

#     # Process each order item
#     for item in order_items:
#         item_id = item.get('item_id')
#         quantity = item.get('quantity')

#         # Find the selected food item
#         food_item = next((item for item in food_items if item['id'] == item_id), None)

#         # Check if the food item exists
#         if food_item is None:
#             return jsonify({'message': 'Invalid food item ID'}), 400

#         # Check if the food item is available
#         if food_item['availability'] != 'Yes':
#             return jsonify({'message': 'Food item is not available'}), 400

#         # Check if the quantity is greater than the available stock
#         if quantity > food_item['stock']:
#             return jsonify({'message': 'Insufficient stock'}), 400

#         # Calculate the total price for the current item
#         item_price = food_item['price'] * quantity
#         total_price += item_price

#         # Update the stock of the food item
#         food_item['stock'] -= quantity

#     # Return the response with the total price
#     order = {
#         "order_id": str(uuid.uuid4()),
#         "customer": user_email,
#         "total_price": total_price,
#         "status": "Received"
#     }
#     orders.append(order)
#     save_orders()
#     save_data(food_items)
#     return jsonify({'message': 'Order placed successfully', 'total_price': total_price}), 200


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
    # initialize_food_items()
    data = request.get_json()
    # new_dish = {
    #     "id":str(uuid.uuid4()),
    #     "name": data["name"],
    #     'price': data['price'],
    #     'availability': data['availability'],
    #     'stock': data['stock']
    # }
    # food_items.append(new_dish)
    # # save updated data in file
    # save_data(food_items)
   
#    mysql code
    cursor = connection.cursor()
    query = "INSERT INTO dishes (name, price, availability, stock) VALUES (%s, %s, %s, %s)"
    dish_values = (data['name'], data['price'], data['availability'], data['stock'])
    cursor.execute(query, dish_values)
    connection.commit()
    cursor.close()
    return jsonify({"msg":"Dish Created Successfully"})

# update dish
@app.route('/dish/<dish_id>', methods=['PATCH'])
@authenticate_and_authorize("Admin")
def update_dish(dish_id):
    # initialize_food_items()
    # dish = find_dish_by_id(dish_id)

    # if not dish:
    #     return jsonify({'message': 'Dish not found'}), 404

    # data = request.get_json()
    # # app.logger.debug(data)
    # dish['name'] = data.get('name', dish['name'])
    # dish['price'] = data.get('price', dish['price'])
    # dish['stock'] = data.get('stock', dish['stock'])
    # dish['availability'] = data.get('availability', dish['availability'])

    # # Reset stock to zero if availability is set to "No"
    # if dish['availability'] == 'No':
    #     dish['stock'] = 0
    # if dish['stock'] == 0:
    #     dish['availability'] = 'No'

    # # Save the updated data to the JSON file
    # save_data(food_items)


    # mysql
    cursor = connection.cursor()
    query = "SELECT * FROM dishes WHERE id = %s"
    cursor.execute(query, (dish_id,))
    dish = cursor.fetchone()

    if not dish:
        cursor.close()
        return jsonify({'message': 'Dish not found'}), 404

    data = request.get_json()
    name = data.get('name', dish[1])
    price = data.get('price', dish[2])
    stock = data.get('stock', dish[4])
    availability = data.get('availability', dish[3])

    # Reset stock to zero if availability is set to "No"
    if availability == 'No':
        stock = 0
    if stock == 0:
        availability = 'No'

    update_query = "UPDATE dishes SET name = %s, price = %s, stock = %s, availability = %s WHERE id = %s"
    update_values = (name, price, stock, availability, dish_id)
    cursor.execute(update_query, update_values)
    connection.commit()
    cursor.close()

    return jsonify({'message': 'Dish updated successfully'}), 200

#  delete dish
@app.route('/dish/<dish_id>', methods=['DELETE'])
@authenticate_and_authorize("Admin")
def delete_dish(dish_id):
    # initialize_food_items()
    # dish = find_dish_by_id(dish_id)

    # if not dish:
    #     return jsonify({'message': 'Dish not found'}), 404

    # food_items.remove(dish)

    # # Save the updated data to the JSON file
    # save_data(food_items)

    # mysql
    cursor = connection.cursor()
    query = "SELECT * FROM dishes WHERE id = %s"
    cursor.execute(query, (dish_id,))
    dish = cursor.fetchone()

    if not dish:
        cursor.close()
        return jsonify({'message': 'Dish not found'}), 404

    delete_query = "DELETE FROM dishes WHERE id = %s"
    cursor.execute(delete_query, (dish_id,))
    connection.commit()
    cursor.close()

    return jsonify({'message': 'Dish deleted successfully'})

    
# all orders
@app.route("/orders", methods=["GET"])
@authenticate_and_authorize("Admin")
def display_orders():
   load_orders()
   return jsonify(orders),200

# orders of specific user
@app.route('/orders-user', methods=['GET'])
@authenticate_and_authorize("User")
def get_user_orders():
    user_id = g.user_id  # Assuming you have stored the user's userid in the g object
    cursor = connection.cursor()
    query = "SELECT * FROM orders WHERE user_id = %s"
    cursor.execute(query, (user_id,))
    orders = cursor.fetchall()
    connection.commit()
    cursor.close()
    # print(orders)
    result =[]
    for item in orders:
        order_dict = {
            "id": item[0],
            "email": item[1],
            "total_price": item[2],
            "status": item[3],
            "user_id": item[4],
            "item_id": item[5],
            "rating": item[6]
        }
        result.append(order_dict)
    
    return jsonify({'orders':result}), 200

@app.route ("/orders/<order_id>", methods = ["PATCH"])
@authenticate_and_authorize("Admin")
def update_status(order_id):
    load_orders()
    order = find_order_by_id(order_id)
    # app.logger.debug(order)
    if not order:
        return jsonify({'message': 'Order not found'}), 404

    data = request.get_json()
    # app.logger.debug(data)
    order['status'] = data.get('status', order['status'])
    
    # Save the updated data to the JSON file
    save_orders()

    return jsonify({'message': 'Order updated successfully'}), 200


if __name__ == '__main__':
    app.run(port=port or 3000)
