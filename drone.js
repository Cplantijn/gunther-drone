'use strict';

var path            = require('path');
var express         = require('express');
var bodyParser      = require('body-parser');
var noble           = require('noble');
var _               = require('underscore');
var app             = express();

//Drone vars
var RollingSpider   = require("rolling-spider");
var knownDevices;
var gunther = '';
var batteryIndicator = null,
    flyingIndicator = null;

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Find BATTERY INFO
app.get('/gunther/get/status', function(req, res){
  var status = {
    'battery': batteryIndicator === null ? 'N/A': batteryIndicator + '%',
    'flying': flyingIndicator
  };

  res.json(status);
});

//Searching
app.get('/gunther/search', function(req, res) {
  knownDevices = [];

  //Dumb hack, have to force to poweredOn
  noble.state = 'poweredOn';

  //Start scan
  noble.startScanning();
  noble.on('discover', function(peripheral) {
    if (!RollingSpider.isDronePeripheral(peripheral)) {
      return; // not a rolling spider
    }
    var details = {
      name: peripheral.advertisement.localName,
      uuid: peripheral.uuid,
    };
    knownDevices.push(details);
  });

  //Give time to populate all devices found, get unique ones
  setTimeout(function(){
      if(knownDevices.length){
        var uniqueDevices = [];
        knownDevices.forEach(function(d) {
          var match = false;
          if(uniqueDevices.length){
            uniqueDevices.forEach(function(u) {
              if(_.isEqual(d, u)){
               match = true;
              }
              if(!match)
                uniqueDevices.push(d);
            });
          }else{
            uniqueDevices.push(d);
          }
        });
        res.send(uniqueDevices);
      }else{
        res.status(404).send('No drones found');
      }
  }, 1800);
});

//Connect To Drone
app.post('/gunther/connect', function(req, res) {
  var uuid = req.body.uuid || null;

  gunther = new RollingSpider({uuid: req.body.uuid});
  gunther.connect(function(){
    gunther.setup(function(){
       gunther.flatTrim();
       gunther.startPing();
       res.json('{"response": "connected"}');
    });

    //Update Battery on post
    gunther.on('battery', function(){
      flyingIndicator = gunther.status.flying;
      batteryIndicator = gunther.status.battery;
    });
  });
});

//Disconnect from Drone
app.get('/gunther/disconnect', function(req, res) {
  gunther.disconnect();
  res.json('{"response": "disconnected"}');
});

//Take Off
app.get('/gunther/takeoff', function(req, res) {
  gunther.takeoff(function(){
    res.json('{"response": "flying"}');
  });
});

//Land
app.get('/gunther/land', function(req, res) {
  gunther.land(function(){
    res.json('{"response": "landing"}');
  });
});

//Die
app.get('/gunther/die', function(req, res) {
  gunther.emergancy(function(){
    res.json('{"response": "dead"}');
  });
});

//Go Up
app.get('/gunther/ascend', function(req, res) {
  gunther.up({speed: 60, steps: 15},function(){
    res.json('{"response": "climbed"}');
  });
});

//Go Down
app.get('/gunther/descend', function(req, res) {
  gunther.down({speed: 60, steps: 15},function(){
    res.json('{"response": "descended"}');
  });
});

//Forward
app.get('/gunther/forward', function(req, res){
  gunther.forward({speed: 50, steps: 15},function(){
    res.json('{"response": "forward"}');
  });
});

//Backward
app.get('/gunther/backward', function(req, res) {
  gunther.backward({speed: 50, steps: 15},function(){
    res.json('{"response": "backward"}');
  });
});

//Strafing
app.get('/gunther/strafe/:direction', function(req, res) {
  var direction = req.params.direction;

  if(direction === 'left'){
    gunther.left({speed: 40, steps: 15},function(){
      res.json('{"response": "strafeLeft"}');
    });
  }else{
    gunther.right({speed: 40, steps: 15},function(){
      res.json('{"response": "strafeRight"}');
    });
  }
});

//Turning
app.get('/gunther/turn/:direction', function(req, res) {
  var direction = req.params.direction;

  if(direction === 'left'){
    gunther.turnLeft({speed: 40, steps: 25},function(){
      res.json('{"response": "turnLeft"}');
    });
  }else{
    gunther.turnRight({speed: 40, steps: 25},function(){
      res.json('{"response": "turnRight"}');
    });
  }
});

//Flips
app.get('/gunther/flip/:direction', function(req, res) {
  var direction = req.params.direction;

  switch(direction){
    case 'front':
      gunther.frontFlip(function(){
        res.json('{"response": "frontFlip"}');
      });
    break;
    case 'right':
      gunther.rightFlip(function(){
        res.json('{"response": "rightFlip"}');
      });
    break;
    case 'back':
     gunther.backFlip(function(){
      res.json('{"response": "backFlip"}');
     });
    break;
    default:
      gunther.leftFlip(function(){
        res.json('{"response": "leftFlip"}');
      });
  }
});

//Init Server
app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
