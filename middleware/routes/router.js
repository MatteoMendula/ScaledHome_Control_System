var my_router = function(io){
  const express = require('express');
  const router = express.Router();
  var mqttClient = require("../mqtt/mqttClientInstance");
  var mqttSettings = require("../mqtt/mqttSettings");

  var simulation_mode = require("../constant/houseSettings").simulation_mode;
  var homeState = require("../model/state");

  var web_app_settings = require("../constant/webAppSettings");

  var state = new homeState();
  var mqttClient = new mqttClient(mqttSettings,state,io, simulation_mode);

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

  router.post('/guiSendMqttCmd',function(req,res){
    var id=req.body.id;
    var value=req.body.value;

    var mex_type = "cmd: ";

    console.log("id = "+id+", value is "+value+" type is :",mex_type);
    var mex = "error";
    if (id == "all"){
        mex = mex_type + ((value == true) ? "open" : "close") + " all";
        //state.motors -> change motors state
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
      state.lamp_state = (value == true) ? 1 : 0;
    }else if (id.includes("fan")){
      mex = mex_type+"fan ";
      mex += (value == true) ? "on" : "off";
      state.fan_state = (value == true) ? 1 : 0;
    }else if (id.includes("ac")){
      mex = mex_type+"ac ";
      mex += (value == true) ? "on" : "off";
      state.ac_state = (value == true) ? 1 : 0;
    }else if (id.includes("heater")){
      mex = mex_type+"heater ";
      mex += (value == true) ? "on" : "off";
      state.heater_state = (value == true) ? 1 : 0;
    }

    console.log("Sending mex:",mex)    
    mqttClient.mqttPublish(mex);
    res.end("ok");
  });

  router.post('/pythonAPI',function(req,res){
    var key = req.body.key;
    var type = req.body.type;
    var value = req.body.value;

    var response = "error no valid key";

    if (key == web_app_settings.api_key) {
      if (type == "cmd"){
        response = "ok";
        mqttClient.mqttPublish(type+": "+value);
      }else if (type == "request"){
        if (value == "last record"){
          response = state.getLastStateAsJsonString();
        }else if(value == "all records collected as string"){
          response = state.getAllRecordsCollected();
        }//else if ... different kind of requests
      }
    }else{
      console.log("received req",req.body)
      console.log("expected key",web_app_settings.api_key)
    }

    res.end(response);
  });

  router.post('/guiGetRecord',function(req,res){

    // console.log("received request for record",req.body)

    var key = req.body.key;

    var response = "error no valid key";

    if (key == web_app_settings.api_key) {
      response = state.getAllRecordsCollected();;
    }
    // console.log("sending response",response);
    res.end(response);
  });

  return router;

}

module.exports = my_router;