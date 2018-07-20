var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var led1 = new Gpio(4, 'out'); //use GPIO pin 4 as output
var led2 = new Gpio(17, 'out'); //use GPIO pin 17 as output
var led3 = new Gpio(27, 'out'); //use GPIO pin 27 as output
var led4 = new Gpio(22, 'out'); //use GPIO pin 22 as output
var pushButton1 = new Gpio(18, 'in', 'both'); //use GPIO pin 5 as input, and 'both' button presses, and releases should be handled
var pushButton2 = new Gpio(23, 'in', 'both'); //use GPIO pin 6 as input, and 'both' button presses, and releases should be handled
var pushButton3 = new Gpio(24, 'in', 'both'); //use GPIO pin 13 as input, and 'both' button presses, and releases should be handled
var pushButton4 = new Gpio(25, 'in', 'both'); //use GPIO pin 19 as input, and 'both' button presses, and releases should be handled
var rn = require('random-number');
var moment = require('moment-timer');

var outputLED = [led1,led2,led3,led4];
var inputButtons = [pushButton1,pushButton2,pushButton3,pushButton4];

app.use(express.static(path.join(__dirname + '/public')));
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    // __dirname es la direccion de server.js

    res.sendFile(path.join(__dirname + '/public/index.html'));
});

http.listen(8080, function(){
  console.log('listening on :8080');
});

io.sockets.on('connection', function (socket) {// WebSocket Connection
  console.log('Conexion iniciada');
  var lightvalue1 = 0; //static variable for current status
  pushButton1.watch(function (err, value1) { //Watch for hardware interrupts on pushButton
    console.log('Interrupcion button1');
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    console.log('Button pressed!, its value was ' + value1);
    lightvalue1 = value1;
    socket.emit('light1', lightvalue1); //send button status to client
  });


  //Status from the Webpage / Client
  socket.on('entrenamiento1', function(data) { //get light switch status0000000000100 f0r0om client
    const totaltime = 90,000
    var counter = data;
    var stepTime = totaltime/counter;
    var no_steps = Math.floor(totaltime/stepTime);
    var valueLed = 0;

    var options = {
    min: 0, max: stepTime, integer: true}

    while (no_steps =! 0) {
      let step = new moment.duration(stepTime).timer(callback);
      step.start();


      }

    }






    if (lightvalue1 != LED1.readSync()) { //only change LED if status has changed
      LED1.writeSync(lightvalue1); //turn LED on or off
    }
  });


   socket.on('entrenamiento2', function(data) { //get light switch status from client
    lightvalue2 = data;
    if (lightvalue2 != LED2.readSync()) { //only change LED if status has changed
      LED2.writeSync(lightvalue2); //turn LED on or off
    }
  });
   socket.on('entrenamiento3', function(data) { //get light switch status from client
    lightvalue3 = data;
    if (lightvalue3 != LED3.readSync()) { //only change LED if status has changed
      LED3.writeSync(lightvalue3); //turn LED on or off
    }
  });
});

process.on('SIGINT', function () { //on ctrl+c
  LED1.writeSync(0); // Turn LED off
  LED1.unexport(); // Unexport LED GPIO to free resources
  pushButton1.unexport(); // Unexport Button GPIO to free resources
  LED2.writeSync(0); // Turn LED off
  LED2.unexport(); // Unexport LED GPIO to free resources
  pushButton2.unexport(); // Unexport Button GPIO to free resources
  LED3.writeSync(0); // Turn LED off
  LED3.unexport(); // Unexport LED GPIO to free resources
  pushButton3.unexport(); // Unexport Button GPIO to free resources
  LED4.writeSync(0); // Turn LED off
  LED4.unexport(); // Unexport LED GPIO to free resources
  pushButton4.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});
