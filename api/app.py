from flask import Flask, request
from flask_cors import CORS
from werkzeug.utils import cached_property
from flask_restplus import Resource, Api
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import date

import config

app = Flask(__name__) 
CORS(app)
api = Api(app)

mongo_URL = "mongodb:27017"

@api.route('/is-alive')
class IsAlive(Resource):
    def get(self):
        return {'message': 'API is alive'}

@api.route('/retrieve-form')
class RetrieveForm(Resource):
    def post(self):
        user  = request.args.get('user', None)

        client = MongoClient(mongo_URL)
        db=client.forms
        collection = db.forms
        req_data = json.loads(request.data.decode("utf-8"))

        results = []

        if "title" in req_data:
            cursor = collection.find({"title": req_data["title"],"creator":user}, {'_id': False})
            for i in cursor:
                results.append(json.dumps(i))
        elif "id" in req_data:
            found = [i for i in collection.find({"_id": ObjectId(req_data["id"])}, {'_id': False})]
            results.append(json.dumps(found))

        return {"data":results}

@api.route('/team/<user>')
class Team(Resource):
    def get(self,user):
        client = MongoClient(mongo_URL)
        db=client.users
        collection = db.user_credentials
        cursor = collection.find_one({"user": user})
        return {"data":json.dumps(cursor["team"])}

@api.route('/inbox')
@api.route('/inbox/<user>')
class Inbox(Resource):
    def get(self,user):
        client = MongoClient(mongo_URL)
        db=client.users
        collection = db.user_workloads
        cursor = collection.find_one({"user": user})
        return {"data":json.dumps(cursor["inbox"])}

    def put(self):
        req_data = json.loads(request.data.decode("utf-8"))
        
        userFrom = req_data["userFrom"]
        userTo = req_data["userTo"]
        task_hash = req_data["task"]
        time = req_data["time"]
        
        client = MongoClient(mongo_URL)
        db=client.users
        collection = db.user_workloads

        cursor = collection.find_one({"user": userFrom})
        doc_id = cursor["_id"]

        task = list(filter(lambda item: item["hash"] == task_hash, cursor["inbox"]))[0]

        collection.update_one({"_id":doc_id},{"$set": { "inbox": 
            list(filter(lambda item: item["hash"] != task_hash, cursor["inbox"]))
        }})

        task["history"].append(
            {
                "event":"Request Assigned to " + userTo,
                "user":userFrom,
                "time":time
            }
        )

        cursor = collection.find_one({"user": userTo})
        doc_id = cursor["_id"]
        collection.update_one({"_id":doc_id},{'$push': {'inbox': task}})

    def patch(self,user):
        req_data = json.loads(request.data.decode("utf-8"))
        obj_hash  = req_data["hash"]
        estimate  = req_data["estimate"]
        time = req_data["time"]

        client = MongoClient(mongo_URL)
        db=client.users
        collection = db.user_workloads
        cursor = collection.find_one({"user": user})
        doc_id = cursor["_id"]


        for index, item in enumerate(cursor["inbox"]):
            if item["hash"] == obj_hash:
                break
        else:
            return {"message":"Error: could not find item in task list"}

        task = cursor["inbox"][index]
        task["estimate"] = estimate
        task["status"] = "In Progress"
        task["history"].append(
            {
                "event":"Estimate submitted",
                "user":user,
                "time":time
            }
        )
        collection.update_one({"_id":doc_id},{'$push': {'tasks': task}})

        new_inbox = cursor["inbox"]
        new_inbox.pop(index)
        collection.update_one({"_id":doc_id},{"$set": { "inbox": new_inbox}})
        return {"message":"success"}

@api.route('/tasks/<user>')
class Tasks(Resource):
    def get(self,user):
        client = MongoClient(mongo_URL)
        db=client.users
        collection = db.user_workloads
        cursor = collection.find_one({"user": user})
        return {"data":json.dumps(cursor["tasks"])}

    def patch(self,user):
        req_data = json.loads(request.data.decode("utf-8"))

        client = MongoClient(mongo_URL)
        db=client.users
        collection = db.user_workloads
        cursor = collection.find_one({"user": user})
        doc_id = cursor["_id"]

        for index, item in enumerate(cursor["tasks"]):
            if item["hash"] == req_data["hash"]:
                break
        else:
            return {"message":"Error: could not find item in task list"}

        new_tasks = cursor["tasks"]
        new_tasks[index] = req_data

        collection.update_one({"_id":doc_id},{"$set": { "tasks": new_tasks}})
        return {"message":"success"}

@api.route('/responses')
class Responses(Resource):
    def get(self):
        form_title  = request.args.get('form_title', None)
        user  = request.args.get('user', None)
        
        client = MongoClient(mongo_URL)
        db=client.forms
        collection = db.forms

        # TODO check against user as well for imported forms
        cursor = collection.find_one({"title": form_title})

        return {"data":json.dumps(cursor["responses"])}
        
    def post(self):
        form_title  = request.args.get('form_title', None)
        user  = request.args.get('user', None)

        client = MongoClient(mongo_URL)
        db=client.forms
        req_data = json.loads(request.data.decode("utf-8"))

        collection = db.forms
        cursor = collection.find_one({"title": form_title})
        doc_id = cursor["_id"]
        collection.update_one({"_id":doc_id},{'$push': {'responses': req_data}})
        
        db=client.users
        collection = db.user_workloads
        cursor = collection.find_one({"creator": user})
        doc_id = cursor["_id"]
        req_data["form_title"] = form_title
        collection.update_one({"_id":doc_id},{'$push': {'inbox': req_data}})

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
        scope  = request.args.get('scope', None)

        client = MongoClient(mongo_URL)
        db=client.forms
        collection = db.forms

        if scope == "team" or scope == "orginization":
            team_collection = client.users.user_credentials
            team_cursor = team_collection.find_one({"user": user})
            team = [user] + team_cursor["team"]
            cursor = collection.find({"creator":{"$in":team}})
        else:
            cursor = collection.find({"creator": user})

        results = []
        for i in cursor:
            i["_id"] = str(i["_id"])
            results.append(json.dumps(i))
        return {"data":results}
    def post(self, user):
        client = MongoClient(mongo_URL)
        db=client.forms
        collection = db.forms
        req_data = json.loads(request.data.decode("utf-8"))
        collection.insert_one(req_data)
        return {"message":"success"}

    def patch(self, user):
        client = MongoClient(mongo_URL)
        db=client.forms
        collection = db.forms
        req_data = json.loads(request.data.decode("utf-8"))
        collection.replace_one({"title": req_data["title"],"creator": user}, req_data)
        return {"message":"success"}

    def delete(self, user):
        client = MongoClient(mongo_URL)
        db=client.forms
        collection = db.forms
        req_data = json.loads(request.data.decode("utf-8"))
        print(req_data["id"])
        collection.delete_one({'_id':ObjectId(req_data["id"])})
        return {"message":"success"}

if __name__ == '__main__':
    app.run(host= '0.0.0.0',port=config.port,debug=True)