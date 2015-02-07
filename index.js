var mic = require('microphone'),
  fs = require('fs');
var Cylon = require('cylon');

var wstream = fs.createWriteStream('hola.mp3');
var grabando = false;

Cylon.robot({
  connections: {
    arduino: {
      adaptor: 'firmata',
      port: '/dev/ttyACM0'
    }
  },

  devices: {
    led: { driver: 'led', pin: 13 },
    button: { driver: 'button', pin: 2}
  },

  work: function(my) {
    every(300, function() {
      console.log(my.button.isPressed());
      if (my.button.isPressed()) {
        if (!grabando) {
          mic.startCapture();
          grabando = true;
          mic.audioStream.on('data', function (data) {
            wstream.write(data);
          });
        }
      } else {
        if (grabando) {
          mic.stopCapture();
          grabando = false;
        }
      }
    });
  }
}).start();
