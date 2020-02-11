const express = require("express");
const path = require("path");
const socket_io = require('socket.io');
const http = require('http');
const bodyParser = require("body-parser");
const app = express();

var server = http.createServer(app);
var io = socket_io.listen(server);
var router = require("./routes/router")(io);

// Set the default views directory to html folder
app.set('views', path.join(__dirname, 'html'));
// Set the view engine to ejs
app.set('view engine', 'ejs');


// Set the folder for css & java scripts
app.use(express.static(path.join(__dirname,'html')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);

server.listen(3000, () => {
  console.log('Server is running at localhost:3000');
});