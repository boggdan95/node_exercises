var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var rn = require('random-number');
var status = 0

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var led1 = new Gpio(4, 'out'); //use GPIO pin 4 as output
var led2 = new Gpio(17, 'out'); //use GPIO pin 17 as output
var led3 = new Gpio(27, 'out'); //use GPIO pin 27 as output
var led4 = new Gpio(22, 'out'); //use GPIO pin 22 as output
var pushButton1 = new Gpio(18, 'in', 'falling', {debounceTimeout: 5}); //use GPIO pin 18 as input, and 'both' button presses, and releases should be handled
var pushButton2 = new Gpio(23, 'in', 'falling', {debounceTimeout: 5}); //use GPIO pin 23 as input, and 'both' button presses, and releases should be handled
var pushButton3 = new Gpio(24, 'in', 'both'); //use GPIO pin 24 as input, and 'both' button presses, and releases should be handled
var pushButton4 = new Gpio(25, 'in', 'both'); //use GPIO pin 25 as input, and 'both' button presses, and releases should be handled
var led = [led1,led2,led3,led4];
var inputButtons = [pushButton1,pushButton2,pushButton3,pushButton4];

//training 2 - fail 2nd intent   // training 3 - fail alternate output


app.use(express.static(path.join(__dirname + '/public')));
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    // __dirname es la direccion de server.js

    res.sendFile(path.join(__dirname + '/public/index.html'));
});

http.listen(3000, function(){
  console.log('listening on :3000');
});

//******************************************************************************
//******************************************************************************

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function on(led_select){
  status = 1;
  if (led_select !== undefined){
  if (status != led_select.readSync()) { //only change LED if status has changed
         led_select.writeSync(status); //turn LED on or off
    }
  }
  else {
    if (status != led[0].readSync()) { //only change LED if status has changed
           led[0].writeSync(status); //turn LED on or off
      }
  }
  console.log('on');
}

function off(led_select){
  status = 0;
  if (led_select !== undefined){
  if (status != led_select.readSync()) { //only change LED if status has changed
         led_select.writeSync(status); //turn LED on or off
    }
  }
  else {
    if (status != led[0].readSync()) { //only change LED if status has changed
           led[0].writeSync(status); //turn LED on or off
      }
  }
  console.log('off');
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  console.log('Conexion iniciada');
  //****************************************************************************
  //****************************************************************************

  socket.on('entrenamiento1', function(data) {
    const totalTime = 90000; //Tiempo total del ejercicio
    const noTry = data; //Numero de repeticiones
    const stepTime = Math.floor(totalTime/noTry); //Tiempo maximo en el que se debe activar/desactivar una salida
    var valueLed = 0; //Estado de la salida
    var activationTime = [];
    var desactivationTime = [];
    var reactionTime = [];
    var hitmissArray = [];

    for (var i = 0; i < noTry; i++) {
      activationTime.push(getRandomInt(0,(stepTime-3000))+(i*stepTime));
    }
    for (var i = 0; i < (noTry-1); i++) {
      desactivationTime.push((i*stepTime)+stepTime);
    }
    desactivationTime.push(totalTime-10); //Se apaga 0.1 segundo antes que termine el entrenamiento

    // for (var i = 0; i < activationTime.length; i++) {
    //   console.log(activationTime[i]);
    //   console.log(desactivationTime[i]);
    // }
    var timeOFF;
    for (var i = 0; i < activationTime.length; i++) {
      setTimeout(function () {
        on();
        var onTime = Date.now();
        inputButtons[0].watch(function (err, value) { //Watch for hardware interrupts on pushButton
             if (err) {console.error('There was an error', err); //output error message to console
             return err;
           }
           if (value != status) {
             off();
             clearTimeout(timeOFF);
             var reaction = Date.now();
             reactionTime.push(reaction-onTime);
             hitmissArray.push('Hit');
           }
        });
      },activationTime[i]);
    }
   for (var i = 0; i < desactivationTime.length; i++) {
         timeOFF = setTimeout(function () {
           off();
           reactionTime.push('--');
           hitmissArray.push('Miss');
         },desactivationTime[i]);
       }

       console.log('Tiempo concluido');


 });

    socket.on('entrenamiento2', function() {
      const step = 10;
      const stepTime = getRandomInt(3,5)*1000;
      const limitTime = 500;
      var activationTime = [];
      var desactivationTime = [];
      var reactionTime = [];
      var hitmissArray = [];

      for (var i = 1; i < step+1; i++) {
        activationTime.push(i*stepTime);
      }
      for (var i = 0; i < step; i++) {
        desactivationTime.push(activationTime[i]+limitTime);
      }

      for (var i = 0; i < activationTime.length; i++) {
        console.log(activationTime[i]);
        console.log(desactivationTime[i]);
      }

      var timeOFF = [];
      var s = 0;
      var onTime;
      var reaction;
      for (var i = 0; i < activationTime.length; i++) {
        setTimeout(function () {
          s = s + i;
          console.log(s);
          on(led[0]);
          onTime = Date.now();
        },activationTime[i]);
      }
     for (var i = 0; i < desactivationTime.length; i++) {
           timeOFF.push(setTimeout(function () {
             off(led[0]);
             reactionTime.push('--');
             hitmissArray.push('Miss');
           },desactivationTime[i]));
         }

         setTimeout(function () {
           console.log('Entrenamiento terminado');
           console.log(reactionTime);
           console.log(hitmissArray);
           s = 0;
         },desactivationTime[desactivationTime.length-1]+2000);

         inputButtons[0].watch(function (err, value) { //Watch for hardware interrupts on pushButton
              if (err) {console.error('There was an error', err); //output error message to console
              return err;
            }
            if (value != status) {
              console.log(s);
              console.log('Cambio de estado');
              clearTimeout(timeOFF[(s/10)-1]);
              off(led[0]);
              console.log('TimeOFF length', timeOFF.length);
              reaction = Date.now();
              reactionTime.push(reaction-onTime);
              hitmissArray.push('Hit');
            }
         });

 });


 socket.on('entrenamiento3', function() {
   const step = 10;
   const stepTime = 3000;
   const limitTime = 1000;
   var activationTime = [];
   var desactivationTime = [];
   var activationModule = [];
   var reactionTime = [];
   var hitmissArray = [];

   for (var i = 1; i < step+1; i++) {
     activationTime.push(i*stepTime);
   }
   for (var i = 0; i < step; i++) {
     desactivationTime.push(activationTime[i]+limitTime);
   }

   for (var i = 0; i < step; i++) {
     activationModule.push(getRandomInt(0,2));
   }

   for (var i = 0; i < activationTime.length; i++) {
     console.log(activationTime[i]);
     console.log(desactivationTime[i]);
     console.log(activationModule[i]);
   }

   var timeOFF = [];
   var s = 0;
   var onTime;
   var reaction;
   for (var i = 0; i < activationTime.length; i++) {
     setTimeout(function () {
       s = s + i;
       on(led[activationModule[i]]);
       onTime = Date.now();
     },activationTime[i]);
   }
  for (var i = 0; i < desactivationTime.length; i++) {
        timeOFF.push(setTimeout(function () {
          off(led[activationModule[i]]);
          reactionTime.push('--');
          hitmissArray.push('Miss');
        },desactivationTime[i]));
      }

      inputButtons[0].watch(function (err, value) { //Watch for hardware interrupts on pushButton
           if (err) {console.error('There was an error', err); //output error message to console
           return err;
         }
         if (value != status) {
           off(led[0]);
           clearTimeout(timeOFF[(s/10)-1]);
           reaction = Date.now();
           reactionTime.push(reaction-onTime);
           hitmissArray.push('Hit');
         }
      });
      inputButtons[1].watch(function (err, value) { //Watch for hardware interrupts on pushButton
           if (err) {console.error('There was an error', err); //output error message to console
           return err;
         }
         if (value != status) {
           off(led[1]);
           clearTimeout(timeOFF[(s/10)-1]);
           reaction = Date.now();
           reactionTime.push(reaction-onTime);
           hitmissArray.push('Hit');
         }
      });

});




});

process.on('SIGINT', function () { //on ctrl+c

  for (var i = 0; i < led.length; i++) {
    led[i].writeSync(0);
    led[i].unexport();
    inputButtons[i].unexport();
  }
  process.exit(); //exit completely

  });
