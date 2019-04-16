from flask import Flask, jsonify
from flask import request
from RobotCommunication import *
import GetPixyInfo
from time import sleep
import requests
import threading

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


app = Flask(__name__)

# {'cmd': '0', 'power': 50}
@app.route('/cmd/<string:data>', methods=['GET'])
def get_task(data):

    print "Got:\t"+data;
    #if data[1:6] == "'c':7":
        #response = ExecuteRemoteCode.execute(data)
    #if data == "{'c':5}":
        
        #response = GetPixyInfo.getSig()#jsonify({'some':'data'})
        
    
        #response = GetPixyInfo.getSig()
    if data == "{'s':0}":
        shutdown_server()
        response = jsonify({"C":'Shutting Down'})
    else:
        print "Sending to Arduino"
        response = jsonify(send_json(data))

    print "Sending to Laptop"
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/sendPixyData', methods=['GET'])
def get_pixy_data():
    while True:
        response = GetPixyInfo.getSig()
        print "Got: "+response
        link = "http://"+request.remote_addr+":3000/pixy/"+response
        print ("Sending Pixy Info to "+request.remote_addr)
        r = requests.get(link, auth=('tester','test'))
        sleep(2)

@app.route("/get_my_ip", methods=["GET"])
def get_my_ip():
    return jsonify({'ip': request.remote_addr}), 200

if __name__ == '__main__':
    GetPixyInfo.startup()
    
    app.run(host = '0.0.0.0')
    threading.Timer(2.5,sendPixyInfo())
    

@app.route('/shutdown/<string:data>', methods=['GET'])
def shutdown():
    shutdown_server()
    return 'Server shutting down...'
    runConnectThread = False;


