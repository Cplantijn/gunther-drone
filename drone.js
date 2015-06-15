var path            = require('path');
var express         = require('express');
var bodyParser      = require('body-parser');
var noble           = require('noble');
var app             = express();

//Drone vars
var RollingSpider   = require("rolling-spider");
var batteryIndicator = null;
var knownDevices;
var gunther = '';

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Find BATTERY INFO
app.get('/battery', function(req, res){
  res.send(batteryIndicator === null ? 'N/A': batteryIndicator + '%');
});
//POST TO DRONE
app.post('/gunther', function(req, res) {
  switch(req.body.action){
    case 'search':
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
          rssi: peripheral.rssi
        };
        knownDevices.push(details);
      });
      //Give time to populate all devices found
      setTimeout(function(){
          if(knownDevices.length){
            res.send(knownDevices);
          }else{
              res.status(404).send('No drones found');
          }
      }, 2400);
      break;
    case 'connect':
        gunther = new RollingSpider({uuid: req.body.uuid});
        gunther.connect(function(){
           gunther.setup(function(){
              gunther.flatTrim();
              gunther.startPing();
              res.send(JSON.parse('{"response": "connected"}'));
           });

           //Update Battery on post
           gunther.on('battery', function(){
             batteryIndicator = gunther.status.battery;
           });
       });
       break;
    case 'disconnect':
      gunther.disconnect();
      res.send(JSON.parse('{"response": "disconnected"}'));
      break;
    case 'takeoff':
      gunther.takeoff(function(){
        res.send(JSON.parse('{"response": "flying"}'));
      });
      break;
    case 'land':
      gunther.land(function(){
        res.send(JSON.parse('{"response": "landing"}'));
      });
      break;
    case 'die':
      gunther.emergancy(function(){
        res.send(JSON.parse('{"response": "dead"}'));
      });
      break;
    case 'ascend':
      gunther.up({speed: 50, steps: 15},function(){
        res.send(JSON.parse('{"response": "climbed"}'));
      });
      break;
    case 'descend':
      gunther.down({speed: 50, steps: 15},function(){
        res.send(JSON.parse('{"response": "descended"}'));
      });
      break;
    case 'forward':
      gunther.forward({speed: 40, steps: 15},function(){
        res.send(JSON.parse('{"response": "forward"}'));
      });
      break;
    case 'backward':
      gunther.backward({speed: 40, steps: 15},function(){
        res.send(JSON.parse('{"response": "backward"}'));
      });
      break;
    case 'strafeLeft':
      gunther.left({speed: 40, steps: 15},function(){
        res.send(JSON.parse('{"response": "strafeLeft"}'));
      });
      break;
    case 'strafeRight':
      gunther.right({speed: 40, steps: 15},function(){
        res.send(JSON.parse('{"response": "strafeRight"}'));
      });
      break;
    case 'turnLeft':
      gunther.turnLeft({speed: 40, steps: 25},function(){
        res.send(JSON.parse('{"response": "turnLeft"}'));
      });
      break;
    case 'turnRight':
      gunther.turnRight({speed: 40, steps: 25},function(){
        res.send(JSON.parse('{"response": "turnRight"}'));
      });
      break;
    //Looks like the callbacks returned by flips cause some issues with the headers. Perhaps they are firing to many times in
    //succession. Will now only allow one response, regardless of success.
    case 'frontFlip':
      gunther.frontFlip(function(){
      });
      res.send(JSON.parse('{"response": "frontFlip"}'));

      break;
    case 'backFlip':
      gunther.backFlip(function(){
      });
      res.send(JSON.parse('{"response": "backFlip"}'));
      break;
    case 'rightFlip':
      gunther.rightFlip(function(){
      });
      res.send(JSON.parse('{"response": "rightFlip"}'));
      break;
      case 'leftFlip':
        gunther.leftFlip(function(){
        });
        res.send(JSON.parse('{"response": "leftFlip"}'));
      break;
      default:
      //none
  }
});

//Init Server
app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
