const rpserver = require('./build/Release/rpserver.node');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');

const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({  extended: true }));

app.use((error, request, response, next) => {
    if (error !== null) {
        return response.json(ERROR(700)); //invalid json
    }
    return next();
});

var port = 3001;
var port2 = 3002;

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            socket.emit('timer', new Date());
        }, interval);
    });
});

io.listen(port2);
console.log("listening on port ", port2);

var webserver = {
     name: 'Robot Web Services',
     hostname: 'http://localhost',
     version: '1.0.0',
     env: process.env.NODE_ENV || 'development',
     port: 3000,
     cors: {
         preflightMaxAge: 5, //Optional
         origins: ['*'],
         allowHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Access-Control-Allow-Origin'],
         acceptable: ['POST']
     }
}

app.listen(port, () => {
    console.log('%s Version: %s ',webserver.name, webserver.version);
    console.log('URL: %s:%s', webserver.hostname, port);
});

app.get('/', function (req, res) {
    res.send('System Active!');
});
/*
app.post('/test', function (req, res) {
    res.send(req.body);
});

app.get('/', function (req, res) {
    res.send('System Active!');
});

app.get('/maps/search/', function(req, res) {
    res.send("tagId is set to " + req.query.api);
});
  
app.use(require('express-status-monitor')());
*/

exports.server = app;


console.log("--------- C++ Function Examples ---------");
console.log("rpserver: ", rpserver);
console.log("Hello World: ", rpserver.helloWorld());
console.log("Add 2 + 3: ", rpserver.add(2,3));
console.log("-----------------------------------------");

//this is the main robot controller arduino that moves the arduino

const robot = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const cmdParser = robot.pipe(new Readline({ delimiter: '\n' }));// Read the port data
var cmd_can_read = false;
var commandServer; 

//each sensor aduino should be added here. 
const sensorPorts = ['/dev/ttyACM1'];

//sensor info 'stack' to be sent
var sensorInfo = []; 

robot.on("error", function(err) {
    console.log('Controller Arduino', err.message);
    process.exit();
})

//just because it is open does not mean it is ready to recieve data
robot.on("open", () => {
    console.log('robot serial port open');
});

//ping pong

var i = 0;
cmdParser.on('data', data =>{
    console.log('got word from arduino:', data);
    
    //note that all strings will terminate with \r
    if(data === 'init\r') {
        cmd_can_read = true;   
    }
/*
    if(cmd_can_read) {
        robot.write( i++ + ": hello from node", (err) => {
            if(err) {
                return console.log("Error on write: ", err.message);
            }
            console.log("message written");
        }); 
    }
*/
});

sensorPorts.forEach( (str) => {
    //unlike other languages, functions in javascript are allocated on the heap 
    //  and not a stack, so these variables will remain in the scope of 
    //  the async functions after the function ends
    const port = new SerialPort(str, { baudRate: 9600 });
    const parser = port.pipe(new Readline({ delimiter: '\n' }));// Read the port data
    var no_error = true;

    port.on('error', function(err) {
        console.log("Sensor", err.message);
        no_error = false;
    })

    if(no_error) {
        port.on("open", () => {
            console.log("sensor serial port open");
        });

        //since these are read-only arduinos for the server,
        //we do not need to wait for when we can write to them.
        parser.on('data', data => {
            console.log("sensor info: ", data);
            //sensorInfo.push(data);
        });
    }
});

/* 
//post data from the sensorInfo stack every 20 ms
//probably a better way, so don't use this.
setInterval(function() {
    if(sensorInfo.length != 0) {
        console.log(sensorInfo);
        console.log("data: ", sensorInfo.pop());
    }
}, 20);
*/

module.exports = rpserver;