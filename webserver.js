var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var rn = require('random-number');
var status = 0



// var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
// var led1 = new Gpio(4, 'out'); //use GPIO pin 4 as output
// var led2 = new Gpio(17, 'out'); //use GPIO pin 17 as output
// var led3 = new Gpio(27, 'out'); //use GPIO pin 27 as output
// var led4 = new Gpio(22, 'out'); //use GPIO pin 22 as output
// var pushButton1 = new Gpio(18, 'in', 'both'); //use GPIO pin 5 as input, and 'both' button presses, and releases should be handled
// var pushButton2 = new Gpio(23, 'in', 'both'); //use GPIO pin 6 as input, and 'both' button presses, and releases should be handled
// var pushButton3 = new Gpio(24, 'in', 'both'); //use GPIO pin 13 as input, and 'both' button presses, and releases should be handled
// var pushButton4 = new Gpio(25, 'in', 'both'); //use GPIO pin 19 as input, and 'both' button presses, and releases should be handled
// var outputLED = [led1,led2,led3,led4];
// var inputButtons = [pushButton1,pushButton2,pushButton3,pushButton4];



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

function on(){
  // status = 1;
  // if (status != led.readSync()) { //only change LED if status has changed
  //        led.writeSync(status); //turn LED on or off
  //   }
  console.log('on');
}

function off(){
  // status = 0;
  // if (status != led.readSync()) { //only change LED if status has changed
  //        led.writeSync(status); //turn LED on or off
  //   }
  console.log('off');
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  console.log('Conexion iniciada');
  //var lightvalue1 = 0; //static variable for current status
  // pushButton1.watch(function (err, value1) { //Watch for hardware interrupts on pushButton
  //   console.log('Interrupcion button1');
  //   if (err) { //if an error
  //     console.error('There was an error', err); //output error message to console
  //     return;
  //   }
  //   console.log('Button pressed!, its value was ' + value1);
  //   lightvalue1 = value1;
  //   socket.emit('light1', lightvalue1); //send button status to client
  // });


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
        // pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
        //      if (err) {console.error('There was an error', err); //output error message to console
        //      return err;
        //    }
        //    if (value != status) {
        //      off();
        //      clearTimeOut(timeOFF);
        //      var reaction = Date.now();
        //      reactionTime.push(reaction-onTime);
        //      hitmissArray.push('Hit');
        //    }
        // });
      },activationTime[i]);
    }
   for (var i = 0; i < desactivationTime.length; i++) {
         timeOFF = setTimeout(function () {
           off();
           // reactionTime.push('--');
           // hitmissArray.push('Miss');
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

      var timeOFF;
      for (var i = 0; i < activationTime.length; i++) {
        setTimeout(function () {
          on();
          var onTime = Date.now();
          // pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
          //      if (err) {console.error('There was an error', err); //output error message to console
          //      return err;
          //    }
          //    if (value != status) {
          //      off();
          //      clearTimeOut(timeOFF);
          //      var reaction = Date.now();
          //      reactionTime.push(reaction-onTime);
          //      hitmissArray.push('Hit');
          //    }
          // });
        },activationTime[i]);
      }
     for (var i = 0; i < desactivationTime.length; i++) {
           timeOFF = setTimeout(function () {
             off();
             // reactionTime.push('--');
             // hitmissArray.push('Miss');
           },desactivationTime[i]);
         }

 });


 socket.on('entrenamiento3', function() {
   const step = 10;
   const stepTime = 3000;
   const limitTime = 1000;
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

   var timeOFF;
   for (var i = 0; i < activationTime.length; i++) {
     setTimeout(function () {
       on();
       var onTime = Date.now();
       // pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
       //      if (err) {console.error('There was an error', err); //output error message to console
       //      return err;
       //    }
       //    if (value != status) {
       //      off();
       //      clearTimeOut(timeOFF);
       //      var reaction = Date.now();
       //      reactionTime.push(reaction-onTime);
       //      hitmissArray.push('Hit');
       //    }
       // });
     },activationTime[i]);
   }
  for (var i = 0; i < desactivationTime.length; i++) {
        timeOFF = setTimeout(function () {
          off();
          // reactionTime.push('--');
          // hitmissArray.push('Miss');
        },desactivationTime[i]);
      }

});

//
// process.on('SIGINT', function () { //on ctrl+c
//   LED1.writeSync(0); // Turn LED off
//   LED1.unexport(); // Unexport LED GPIO to free resources
//   pushButton1.unexport(); // Unexport Button GPIO to free resources
//   LED2.writeSync(0); // Turn LED off
//   LED2.unexport(); // Unexport LED GPIO to free resources
//   pushButton2.unexport(); // Unexport Button GPIO to free resources
//   LED3.writeSync(0); // Turn LED off
//   LED3.unexport(); // Unexport LED GPIO to free resources
//   pushButton3.unexport(); // Unexport Button GPIO to free resources
//   LED4.writeSync(0); // Turn LED off
//   LED4.unexport(); // Unexport LED GPIO to free resources
//   pushButton4.unexport(); // Unexport Button GPIO to free resources
//   process.exit(); //exit completely
});
