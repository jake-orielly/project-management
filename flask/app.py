from flask import Flask, request
from flask_cors import CORS
from flask_restplus import Resource, Api
import json
from pymongo import MongoClient

app = Flask(__name__) 
api = Api(app)
CORS(app)

mongo_URL = "0.0.0.0:27017"

@api.route('/is-alive')
class isAlive(Resource):
    def get(self):
        return {'message': 'API is alive'}

@api.route('/get-form/<name>')
class GetForm(Resource):
    def get(self, name):
        client = MongoClient(mongo_URL)
        db=client.project_management
        collection = db[name]
        cursor = collection.find({}, {'_id': False})
        results = []
        for i in cursor:
            results.append(json.dumps(i))
        return {"data":results}

@api.route('/get-user-forms/<user>')
class GetUserForms(Resource):
    def get(self, user):
        client = MongoClient(mongo_URL)
        db=client.user_forms
        collection = db[user]
        cursor = collection.find({}, {'_id': False})
        results = []
        for i in cursor:
            results.append(json.dumps(i))
        return {"data":results}

@api.route('/login')
class Login(Resource):
    def post(self):
        client = MongoClient(mongo_URL)
        db=client.users
        collection = db.user_credentials
        req_data = json.loads(request.data.decode("utf-8"))
        db_user = collection.find_one({"user": req_data["user"]}, {'_id': False})
        if (db_user["password"] == req_data["password"]):
            return {"message":"success"}
        else:
            return {"message":"failure"}

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)