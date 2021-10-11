import time

import redis
from flask import Flask
import pymongo

app = Flask(__name__)
cache = redis.Redis(host='redis', port=6379)


print("hello")
myclient = pymongo.MongoClient("mongodb://mongodb:27017/")
mydb = myclient["mydatabase"]
print(myclient.list_database_names())

def get_hit_count():
    retries = 5
    while True:
        try:
            return cache.incr('hits')
        except redis.exceptions.ConnectionError as exc:
            if retries == 0:
                raise exc
            retries -= 1
            time.sleep(0.5)

@app.route('/mongo')
def mongo():    
    mycol = mydb["customers"]
    mydict = { "name": "John", "address": "Highway 37" }
    x = mycol.insert_one(mydict)
    x = mycol.find_one()
    return str(mycol.find_one())

@app.route('/')
def hello():
    count = get_hit_count()
    return 'Hello Docker! I have been seen {} times.\n'.format(count)