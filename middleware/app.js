const express = require("express");
const path = require("path");

var io = require('socket.io');
var http = require('http');

var http = require('http');

var web_app_settings = require("./constant/webAppSettings");

var bodyParser = require("body-parser");

// var client  = mqtt.connect("mqtt://m12.cloudmqtt.com",
//                             {
//                                 clientId:"mqttjs01",
//                                 username: "home_controller",
//                                 password: "home",
//                                 port: 11110
//                             });


const app = express();

var server = http.createServer(app);
var io = io.listen(server);

var router = require("./routes/router")(io);

// Set the default views directory to html folder
app.set('views', path.join(__dirname, 'html'));

// Set the folder for css & java scripts
app.use(express.static(path.join(__dirname,'html')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.set('socketio', io);


//console.log(path.join(__dirname, 'node_modules'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

app.use('/', router);

server.listen(3000, () => {
  console.log('Server is running at localhost:3000');
});