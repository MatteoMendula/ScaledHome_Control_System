var my_router = function(io){
  const express = require('express');
  const router = express.Router();
  var mqttClient = require("../mqtt/mqttClientInstance");
  var mqttSettings = require("../mqtt/mqttSettings");

  var homeState = require("../model/state");

  var web_app_settings = require("../constant/webAppSettings");

  var state = new homeState();
  var mqttClient = new mqttClient(mqttSettings,state,io);

  var mex_type = "cmd: ";

  router.get('/', (req, res) => {
    console.log('Request for home received');
    // mqttClient.mqttPublish(topic, "close all");

    // const io = req.app.get('socketio');

    io.on('connection', socket => {

      console.log("new socket conection");
      let socket_id = [];

      socket_id.push(socket.id);
      if (socket_id[0] === socket.id) {
        // remove the connection listener for any subsequent 
        // connections with the same ID
        io.removeAllListeners('connection'); 
      }

      // socket.on('hello message', msg => {
      //   console.log('just got: ', msg);
      //   socket.emit('chat message', 'hi from server');

      // })

  });

    res.render('index', {gui_url: web_app_settings.gui_url});
  });

  // router.get('/about', (req, res) => {
  //   console.log('Request for about page recieved');
  //   res.render('about');
  // });

  // router.get('/contact', (req, res) => {
  //   console.log('Request for contact page recieved');
  //   res.render('contact');
  // });

  router.post('/mqttgui',function(req,res){
    var id=req.body.id;
    var value=req.body.value;
    console.log("id = "+id+", value is "+value+" type is :",mex_type);
    var mex = "error";
    if (id == "all"){
        mex = mex_type + ((value == true) ? "open" : "close") + " all";
    }else if (id.includes("doors")){
        mex = mex_type + ((value == true) ? "open" : "close") + " all doors";
    }else if (id.includes("windows")){
        mex = mex_type + ((value == true) ? "open" : "close") + " all windows";
    }else if (id.includes("motor")){
        mex = mex_type
        mex += (value == true) ? "open" : "close";
        mex += " "+id.substring(5, id.length);
    }else if (id.includes("lamp")){
      mex = mex_type+"lamp ";
      mex += (value == true) ? "on" : "off";
    }else if (id.includes("fan")){
      mex = mex_type+"fan ";
      mex += (value == true) ? "on" : "off";
    }else if (id.includes("ac")){
      mex = mex_type+"ac ";
      mex += (value == true) ? "on" : "off";
    }else if (id.includes("heater")){
      mex = mex_type+"heater ";
      mex += (value == true) ? "on" : "off";
    }

    console.log("Sending mex:",mex)    
    mqttClient.mqttPublish(mex);
    res.end("ok");
  });

  router.post('/mqttpythoncmd',function(req,res){
    var key = req.body.key;
    var cmd=req.body.cmd;

    var response = "error no valid key";

    if (key == web_app_settings.key) {
      response = "ok";
      mqttClient.mqttPublish(mex_type+cmd);
    }

    res.end(response);
  });

  router.post('/mqttgetrecord',function(req,res){

    // console.log("received request for record",req.body)

    var key = req.body.key;

    var response = "error no valid key";

    if (key == web_app_settings.key) {
      response = state.getStateToCSVFile();;
    }
    // console.log("sending response",response);
    res.end(response);
  });

  return router;

}

module.exports = my_router;