import pytest
import json
from app import app
import mysql.connector
from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify

load_dotenv()
username = os.getenv("user_name")
password = os.getenv("password")
databasename = os.getenv("databasename")

app.config['MYSQL_USER'] = username
app.config['MYSQL_PASSWORD'] = password
app.config['MYSQL_DB'] = databasename


@pytest.fixture(autouse=True)
def client():
    app.config['TESTING'] = True

    connection = mysql.connector.connect(
        host='localhost',
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB']
    )

    with app.test_client() as client:
        yield client

    # Close the connection
    connection.close()


def test_get_menu(client):
    response = client.get("/menu")
    data = response.get_json()
    assert response.status_code == 200
    # checking for random items if they are present in response
    assert any(item['name'] == 'Pizza' for item in data)
    assert any(item['name'] == 'Limca' for item in data)
