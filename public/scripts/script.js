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
    socket.emit('entrenamiento1',randomInt(10,25));
  }
}
