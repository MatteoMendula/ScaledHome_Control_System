var my_router = function(io){
  const express = require('express');
  const router = express.Router();
  var mqttClient = require("../mqtt/mqttClientInstance");
  var mqttSettings = require("../mqtt/mqttSettings");
  var middlwareActions = require("../actions/middlwareActions");

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
    if (id.includes("all")){
      var action = (value == true) ? "open" : "close";
      middlwareActions.handleMotors(mqttClient.mqttPublish,action, state);
      //state.motors -> change motors state
    }else if (id.includes("doors")){
      var action = (value == true) ? "open" : "close";
      middlwareActions.handleMotors(mqttClient.mqttPublish,action, state, "all doors");
    }else if (id.includes("windows")){
      var action = (value == true) ? "open" : "close";
      middlwareActions.handleMotors(mqttClient.mqttPublish,action, state, "all windows");
    }else if (id.includes("motor")){
        var action = (value == true) ? "open" : "close";
        middlwareActions.handleMotors(mqttClient.mqttPublish,action, state, id.substring(5, id.length));
    }else if (id.includes("lamp")){
      var action = (value == true) ? "on" : "off";
      // state.lamp_state = (value == true) ? 1 : 0;
      middlwareActions.handleLamp(mqttClient.mqttPublish, action, state);
    }else if (id.includes("fan")){
      var action = (value == true) ? "on" : "off";
      // state.fan_state = (value == true) ? 1 : 0;
      middlwareActions.handleFan(mqttClient.mqttPublish, action, state);
    }else if (id.includes("ac")){
      var action = (value == true) ? "on" : "off";
      // state.ac_state = (value == true) ? 1 : 0;
      middlwareActions.handleAc(mqttClient.mqttPublish, action, state);
    }else if (id.includes("heater")){
      var action = (value == true) ? "on" : "off";
      // state.heater_state = (value == true) ? 1 : 0;
      middlwareActions.handleHeater(mqttClient.mqttPublish, action, state);
    }

    // console.log("-------------------------------------",state.motors_state)

    // console.log("Sending mex:",mex)    
    // mqttClient.mqttPublish(mex);
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
        // mqttClient.mqttPublish(type+": "+value);
        if (value.includes("lamp ")){
          middlwareActions.handleLamp(mqttClient.mqttPublish, value.split("lamp ")[1], state);
        }else if (value.includes("fan ")){
          middlwareActions.handleFan(mqttClient.mqttPublish, value.split("fan ")[1], state);
        }else if (value.includes("ac ")){
          middlwareActions.handleAc(mqttClient.mqttPublish, value.split("ac ")[1], state);
        }else if (value.includes("heater ")){
          middlwareActions.handleHeater(mqttClient.mqttPublish, value.split("heater ")[1], state);
        }else{
          console.log("unknown cmd from Python: ", value);
        }
      }else if (type == "request"){
        if (value == "last record"){
          response = state.getLastStateAsJsonString();
        }else if(value == "all records collected as string"){
          response = state.getAllRecordsCollected();
        }//else if ... different kind of requests
      }
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