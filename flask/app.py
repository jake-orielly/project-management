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

@api.route('/retrieve-form')
class RetrieveForm(Resource):
    def post(self):
        client = MongoClient(mongo_URL)
        db=client.project_management
        collection = db.ann_perkins_forms
        req_data = json.loads(request.data.decode("utf-8"))
        cursor = collection.find({"title": req_data["title"]}, {'_id': False})
        results = []
        for i in cursor:
            results.append(json.dumps(i))
        return {"data":results}

@api.route('/responses/<form_title>')
class Responses(Resource):
    def get(self,form_title):
        client = MongoClient(mongo_URL)
        db=client.project_management
        collection = db.ann_perkins_forms
        cursor = collection.find_one({"title": form_title})
        return {"data":json.dumps(cursor["responses"])}
        
    def post(self,form_title):
        client = MongoClient(mongo_URL)
        db=client.project_management
        collection = db.ann_perkins_forms
        req_data = json.loads(request.data.decode("utf-8"))
        cursor = collection.find_one({"title": form_title})
        doc_id = cursor["_id"]
        collection.update({"_id":doc_id},{'$push': {'responses': req_data}})
        return {"message":"success"}

@api.route('/login')
class Login(Resource):
    def post(self):
        client = MongoClient(mongo_URL)
        db=client.users
        collection = db.user_credentials
        req_data = json.loads(request.data.decode("utf-8"))
        db_user = collection.find_one({"user": req_data["user"]}, {'_id': False})
        if (db_user != None and db_user["password"] == req_data["password"]):
            return {"message":"success"}
        else:
            return {"message":"failure"}

@api.route('/forms', defaults={'user': None})
@api.route('/forms/<user>')
class Forms(Resource):
    def get(self, user):
        client = MongoClient(mongo_URL)
        db=client.project_management
        collection = db[user + "_forms"]
        cursor = collection.find({}, {'_id': False})
        results = []
        for i in cursor:
            results.append(json.dumps(i))
        return {"data":results}
    def post(self, user):
        client = MongoClient(mongo_URL)
        db=client.project_management
        collection = db.ann_perkins_forms
        req_data = json.loads(request.data.decode("utf-8"))
        collection.insert_one(req_data)
        return {"message":"success"}

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)