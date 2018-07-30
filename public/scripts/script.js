var socket = io(); //load socket.io-client and connect to the host that serves the page

window.addEventListener("load", function(){ //when page loads
  var lightbox1 = document.getElementById("light1");
  var lightbox2 = document.getElementById("light2");
  var lightbox3 = document.getElementById("light3");
  var lightbox4 = document.getElementById("light4");

});


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function game(value){
  if (value === 1){
    console.log("Juego 1");
    var number = randomInt(10,20)
    socket.emit('entrenamiento1', number);
    console.log(number);
  }
  if (value === 2){
    console.log("Juego 2");
    socket.emit('entrenamiento2');
  }
  if (value === 3){
    console.log("Juego 3");
    socket.emit('entrenamiento3');
  }
}
