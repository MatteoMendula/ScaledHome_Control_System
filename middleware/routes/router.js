const express = require('express');
const router = express.Router();
var mqttClient = require("../mqtt/mqttClientInstance");
var mqttSettings = require("../mqtt/mqttSettings");

var homeState = require("../model/state");

var web_app_settings = require("../constant/webAppSettings");

var state = new homeState();
var mqttClient = new mqttClient(mqttSettings,state);

var mex_type = "cmd: ";

router.get('/', (req, res) => {
  console.log('Request for home received');
  // mqttClient.mqttPublish(topic, "close all");
  res.render('index', {gui_post_url: web_app_settings.gui_post_url});
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
      mex = mex_type+(value == true) ? "open all" : "close all";
  }else if (id == "doors"){
      mex = mex_type+(value == true) ? "open all doors" : "close all doors";
  }else if (id == "windows"){
      mex = mex_type+(value == true) ? "open all windows" : "close all windows";
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

router.post('/mqttpythonrecord',function(req,res){
  var key = req.body.key;

  var response = "error no valid key";

  if (key == web_app_settings.key) {
    response = state.getStateAsString();;
  }

  res.end(response);
});

module.exports = router;