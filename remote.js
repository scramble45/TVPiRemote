const async = require('async')
    , path = require('path')
    , execSh = require("exec-sh")
    , request = require('request')
    , xml2js = require('xml2js')
    , parser = new xml2js.Parser()
    , express = require("express")
    , app = require('express')()
    , server = require('http').Server(app)
    , io = require('socket.io')(server)
    , net = require('net')
    ;

server.listen(80);

app.use(express.static(__dirname));
app.use(express.static(__dirname + "/"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/remote.html'));
});


// http://192.168.10.176/MainZone/index.put.asp?cmd0=PutMasterVolumeSet/-20.0


// Get Current Config
// http://192.168.10.176/goform/formMainZone_MainZoneXml.xml

// Reciever INFO
var marantzIp = '192.168.10.176';
var mainZoneSendCmd = 'http://' + marantzIp + '/MainZone/index.put.asp?cmd0='

// GET Function
var get = function (url) {
  request(url, function (error, response) {
    if (!error && response.statusCode == 200) {
      console.log('[Reponse]:', response.statusCode, '[URL]:', url + '\r\n')
      if (error) { console.log('[Request Error]', error + '\r\n') }
    };
  });
};

// Create socket server
// TCP Socket Communication

var HOST = '0.0.0.0';
var PORT = 6969;

net.createServer(function (sock) {

  // We have a connection - a socket object is assigned to the connection automatically
  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

  // Add a 'data' event handler to this instance of socket
  sock.on('data', function (data) {
    console.log('DATA ' + sock.remoteAddress + ': ' + data);
    if (data == "power\r\n") {
      console.log('Power Toggled');
      var ampconfig = {};
      async.auto({
        Func1: function (callback) { // Pull reciever configuration file and parse
          request('http://' + marantzIp + '/goform/formMainZone_MainZoneXml.xml', function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var parseString = require('xml2js').parseString;
              var xmldata = body;
              parseString(xmldata, function (err, result) {
                var obj = JSON.stringify(result);
                var h = JSON.parse(obj);
                var n = (h.item.Power[0].value);
                var x = JSON.stringify(n);

                ampconfig.Power = (x.replace('[', '').replace(']', '').replace('"', '').replace('"', ''));
              });
              if (error) { console.log('[Request Error]', error) }
            };
            return callback(null, "Func1");
          });
        },
        func2: ["Func1", function (results, callback) {
          // Check if the reciever power mode
          if (ampconfig.Power == 'ON') {
            get(mainZoneSendCmd + 'PutZone_OnOff/OFF'); // turn off reciever

            var ps4 = execSh(["ps4-waker standby"], true, // put ps4 to into standby
              function (err, stdout, stderr) {
                if (err || stderr) {
                  console.error("error: ", err);
                  console.error("stderr: ", stderr);
                }
                console.log(stdout);
              });

            var tvOff = execSh(["sleep 3 && irsend SEND_ONCE Epson_12807990 KEY_POWER && sleep 2 && irsend SEND_ONCE Epson_12807990 KEY_POWER"], true, // turn off projector
              function (err, stdout, stderr) {
                if (err || stderr) {
                  console.error("error: ", err);
                  console.error("stderr: ", stderr);
                }
                console.log(stdout);
              });


          } else {
            get(mainZoneSendCmd + 'PutZone_OnOff/ON');
            var tvOn = execSh(["irsend SEND_ONCE Epson_12807990 KEY_POWER"], true, // turn on projector
              function (err, stdout, stderr) {
                if (err || stderr) {
                  console.error("error: ", err);
                  console.error("stderr: ", stderr);
                }
                console.log(stdout);
              });
            return callback(null, "Func2");
          }
        }],
        func3: ["func2", function (results, callback) {
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeSet/-20.0'); // set volume to 60.0
            return callback(null, "Func3");
          }, 3000);
        }],
        func4: ["func3", function (results, callback) { // turn on playstation if not already on
          var ps4 = execSh(["ps4-waker"], true,
            function (err, stdout, stderr) {
              if (err || stderr) {
                console.error("error: ", err);
                console.error("stderr: ", stderr);
              }
              console.log(stdout);
              return callback(null, "Func4");
            });
        }],
        func5: ["func4", function (results, callback) {

          return callback(null, "Func5");
        }],
        func6: ["func5", function (results, callback) {
          return callback(null, "Func6");
        }]
      },
        function (err, results) {
          if (err) { console.error("Error:" + err); } else { }
        });
    }

    if (data == "volumeup\r\n") {
      console.log('Volume Up');
      async.auto({
        Func1: function (callback) { // Pull reciever configuration file and parse
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
            return callback(null, "Func1");
          }, 1000);
        },
        func2: ["Func1", function (results, callback) {
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
            return callback(null, "Func2");
          }, 1000);
        }],
        func3: ["func2", function (results, callback) {
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
            return callback(null, "Func3");
          }, 1000);
        }],
        func4: ["func3", function (results, callback) {
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
            return callback(null, "Func4");
          }, 1000);
        }],
        func5: ["func4", function (results, callback) {
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
            return callback(null, "Func5");
          }, 1000);
        }]
      },
        function (err, results) {
          if (err) { console.error("Error:" + err); } else { }
        });
    }

    if (data == "volumedown\r\n") {
      console.log('Volume Down');
      async.auto({
        Func1: function (callback) { // Pull reciever configuration file and parse
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
            return callback(null, "Func1");
          }, 1000);
        },
        func2: ["Func1", function (results, callback) {
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
            return callback(null, "Func2");
          }, 1000);
        }],
        func3: ["func2", function (results, callback) {
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
            return callback(null, "Func3");
          }, 1000);
        }],
        func4: ["func3", function (results, callback) {
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
            return callback(null, "Func4");
          }, 1000);
        }],
        func5: ["func4", function (results, callback) {
          setTimeout(function () {
            get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
            return callback(null, "Func5");
          }, 1000);
        }]
      },
        function (err, results) {
          if (err) { console.error("Error:" + err); } else { }
        });
    }

    if (data == "source1\r\n") {
      console.log('Source One');
      get(mainZoneSendCmd + 'PutZone_InputFunction%2FBD');
    }

    if (data == "source2\r\n") {
      console.log('Source Two');
      get(mainZoneSendCmd + 'PutZone_InputFunction%2FGAME');
    }

    if (data == "source3\r\n") {
      console.log('Source Three');
      get(mainZoneSendCmd + 'PutZone_InputFunction%2FMPLAY');
    }

    // Write the data back to the socket, the client will receive it as data from the server
    sock.write(data, '\r\n');
  });

  // Add a 'close' event handler to this instance of socket
  sock.on('close', function (data) {
    console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
  });

}).listen(PORT, HOST);

console.log('TCP Socket Server listening on ' + HOST + ':' + PORT);

// End of socket Server


// Socket.io on connection
io.on('connection', function (socket) {
  // socket.emit('remote', { hello: 'world' });
  //    socket.on('my other event', function (data) {
  //        console.log(data);
  //    });
  //    socket.on('remote', function(data) {
  //        console.log('Fuck ya');
  //    });

  // Extended pages for controlling stuff from Alexa
  app.get('/volumeup', function (req, res) {
    res.send('Volume has been adjusted up...');
    async.auto({
      Func1: function (callback) { // Pull reciever configuration file and parse
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
          return callback(null, "Func1");
        }, 1000);
      },
      func2: ["Func1", function (results, callback) {
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
          return callback(null, "Func2");
        }, 1000);
      }],
      func3: ["func2", function (results, callback) {
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
          return callback(null, "Func3");
        }, 1000);
      }],
      func4: ["func3", function (results, callback) {
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
          return callback(null, "Func4");
        }, 1000);
      }],
      func5: ["func4", function (results, callback) {
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
          return callback(null, "Func5");
        }, 1000);
      }]
    },
      function (err, results) {
        if (err) { console.error("Error:" + err); } else { }
      });
    console.log('Volume was toggled going up from alexa');

  });

  app.get('/volumedown', function (req, res) {
    res.send('Volume has been adjusted down...');
    async.auto({
      Func1: function (callback) { // Pull reciever configuration file and parse
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
          return callback(null, "Func1");
        }, 1000);
      },
      func2: ["Func1", function (results, callback) {
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
          return callback(null, "Func2");
        }, 1000);
      }],
      func3: ["func2", function (results, callback) {
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
          return callback(null, "Func3");
        }, 1000);
      }],
      func4: ["func3", function (results, callback) {
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
          return callback(null, "Func4");
        }, 1000);
      }],
      func5: ["func4", function (results, callback) {
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
          return callback(null, "Func5");
        }, 1000);
      }]
    },
      function (err, results) {
        if (err) { console.error("Error:" + err); } else { }
      });
    console.log('Volume was toggled going down from alexa');
  });

  app.get('/power', function (req, res) {
    res.send('Power was toggled...');
    var ampconfig = {};
    async.auto({
      Func1: function (callback) { // Pull reciever configuration file and parse
        request('http://' + marantzIp + '/goform/formMainZone_MainZoneXml.xml', function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var parseString = require('xml2js').parseString;
            var xmldata = body;
            parseString(xmldata, function (err, result) {
              var obj = JSON.stringify(result);
              var h = JSON.parse(obj);
              var n = (h.item.Power[0].value);
              var x = JSON.stringify(n);

              ampconfig.Power = (x.replace('[', '').replace(']', '').replace('"', '').replace('"', ''));
            });
            if (error) { console.log('[Request Error]', error) }
          };
          return callback(null, "Func1");
        });
      },
      func2: ["Func1", function (results, callback) {
        // Check if the reciever power mode
        if (ampconfig.Power == 'ON') {
          get(mainZoneSendCmd + 'PutZone_OnOff/OFF'); // turn off reciever

          var ps4 = execSh(["ps4-waker standby"], true, // put ps4 to into standby
            function (err, stdout, stderr) {
              if (err || stderr) {
                console.error("error: ", err);
                console.error("stderr: ", stderr);
              }
              console.log(stdout);
            });

          var tvOff = execSh(["sleep 3 && irsend SEND_ONCE Epson_12807990 KEY_POWER && sleep 2 && irsend SEND_ONCE Epson_12807990 KEY_POWER"], true, // turn off projector
            function (err, stdout, stderr) {
              if (err || stderr) {
                console.error("error: ", err);
                console.error("stderr: ", stderr);
              }
              console.log(stdout);
            });


        } else {
          get(mainZoneSendCmd + 'PutZone_OnOff/ON');
          var tvOn = execSh(["irsend SEND_ONCE Epson_12807990 KEY_POWER"], true, // turn on projector
            function (err, stdout, stderr) {
              if (err || stderr) {
                console.error("error: ", err);
                console.error("stderr: ", stderr);
              }
              console.log(stdout);
            });
          return callback(null, "Func2");
        }
      }],
      func3: ["func2", function (results, callback) {
        setTimeout(function () {
          get(mainZoneSendCmd + 'PutMasterVolumeSet/-20.0'); // set volume to 60.0
          return callback(null, "Func3");
        }, 3000);
      }],
      func4: ["func3", function (results, callback) { // turn on playstation if not already on
        var ps4 = execSh(["ps4-waker"], true,
          function (err, stdout, stderr) {
            if (err || stderr) {
              console.error("error: ", err);
              console.error("stderr: ", stderr);
            }
            console.log(stdout);
            return callback(null, "Func4");
          });
      }],
      func5: ["func4", function (results, callback) {

        return callback(null, "Func5");
      }],
      func6: ["func5", function (results, callback) {
        return callback(null, "Func6");
      }]
    },
      function (err, results) {
        if (err) { console.error("Error:" + err); } else { }
      });
    console.log('Power was toggled from alexa');
  });

  app.get('/playstation', function (req, res) {
    res.send('Source Playstation toggled...');
    get(mainZoneSendCmd + 'PutZone_InputFunction%2FBD');
    console.log('Source Playstation was toggled from alexa');
  });

  app.get('/nintendo', function (req, res) {
    res.send('Source nintendo toggled...');
    get(mainZoneSendCmd + 'PutZone_InputFunction%2FGAME');
    console.log('Source nintendo was toggled from alexa');
  });

  app.get('/appleTV', function (req, res) {
    res.send('Source appleTV toggled...');
    get(mainZoneSendCmd + 'PutZone_InputFunction%2FMPLAY');
    console.log('Source appleTV was toggled from alexa');
  });



  socket.on('remote', function (msg) {
    try {
      var jsonCont = JSON.parse(msg);


      if (jsonCont.button == 'Power') {
        var button = jsonCont.button;
        console.log('[Button]:', button, 'Was Pressed')

        var ampconfig = {};



        async.auto({
          Func1: function (callback) { // Pull reciever configuration file and parse
            request('http://' + marantzIp + '/goform/formMainZone_MainZoneXml.xml', function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var parseString = require('xml2js').parseString;
                var xmldata = body;
                parseString(xmldata, function (err, result) {
                  var obj = JSON.stringify(result);
                  var h = JSON.parse(obj);
                  var n = (h.item.Power[0].value);
                  var x = JSON.stringify(n);

                  ampconfig.Power = (x.replace('[', '').replace(']', '').replace('"', '').replace('"', ''));
                });
                if (error) { console.log('[Request Error]', error) }
              };
              return callback(null, "Func1");
            });
          },
          func2: ["Func1", function (results, callback) {
            // Check if the reciever power mode
            if (ampconfig.Power == 'ON') {
              get(mainZoneSendCmd + 'PutZone_OnOff/OFF'); // turn off reciever

              var ps4 = execSh(["ps4-waker standby"], true, // put ps4 to into standby
                function (err, stdout, stderr) {
                  if (err || stderr) {
                    console.error("error: ", err);
                    console.error("stderr: ", stderr);
                  }
                  console.log(stdout);
                });

              var tvOff = execSh(["sleep 3 && irsend SEND_ONCE Epson_12807990 KEY_POWER && sleep 2 && irsend SEND_ONCE Epson_12807990 KEY_POWER"], true, // turn off projector
                function (err, stdout, stderr) {
                  if (err || stderr) {
                    console.error("error: ", err);
                    console.error("stderr: ", stderr);
                  }
                  console.log(stdout);
                });


            } else {
              get(mainZoneSendCmd + 'PutZone_OnOff/ON');
              var tvOn = execSh(["irsend SEND_ONCE Epson_12807990 KEY_POWER"], true, // turn on projector
                function (err, stdout, stderr) {
                  if (err || stderr) {
                    console.error("error: ", err);
                    console.error("stderr: ", stderr);
                  }
                  console.log(stdout);
                });
              return callback(null, "Func2");
            }
          }],
          func3: ["func2", function (results, callback) {
            setTimeout(function () {
              get(mainZoneSendCmd + 'PutMasterVolumeSet/-20.0'); // set volume to 60.0
              return callback(null, "Func3");
            }, 3000);
          }],
          func4: ["func3", function (results, callback) { // turn on playstation if not already on
            var ps4 = execSh(["ps4-waker"], true,
              function (err, stdout, stderr) {
                if (err || stderr) {
                  console.error("error: ", err);
                  console.error("stderr: ", stderr);
                }
                console.log(stdout);
                return callback(null, "Func4");
              });
          }],
          func5: ["func4", function (results, callback) {

            return callback(null, "Func5");
          }],
          func6: ["func5", function (results, callback) {
            return callback(null, "Func6");
          }]
        },
          function (err, results) {
            if (err) { console.error("Error:" + err); } else { }
          });

      } //end of if



      if (jsonCont.button == 'PS4') {
        //io.emit('heartbeat', msg)
        var button = jsonCont.button;
        get(mainZoneSendCmd + 'PutZone_InputFunction%2FBD');
        console.log('[Button]:', button, 'Was Pressed')
      } //end of if            


      if (jsonCont.button == 'wii') {
        //io.emit('heartbeat', msg) //
        var button = jsonCont.button;
        get(mainZoneSendCmd + 'PutZone_InputFunction%2FGAME');
        console.log('[Button]:', button, 'Was Pressed')
      } //end of if  

      if (jsonCont.button == 'switch') {
        //io.emit('heartbeat', msg) //
        var button = jsonCont.button;
        get(mainZoneSendCmd + 'PutZone_InputFunction%2FAUX2');
        console.log('[Button]:', button, 'Was Pressed')
      } //end of if  

      if (jsonCont.button == 'appleTV') {
        //io.emit('heartbeat', msg)
        var button = jsonCont.button;
        get(mainZoneSendCmd + 'PutZone_InputFunction%2FMPLAY');
        console.log('[Button]:', button, 'Was Pressed')
      } //end of if 


      if (jsonCont.button == 'volUp') {
        //io.emit('heartbeat', msg)
        var button = jsonCont.button;
        get(mainZoneSendCmd + 'PutMasterVolumeBtn/>');
        console.log('[Button]:', button, 'Was Pressed')
      } //end of if 


      if (jsonCont.button == 'volDown') {
        //io.emit('heartbeat', msg)
        var button = jsonCont.button;
        get(mainZoneSendCmd + 'PutMasterVolumeBtn/<');
        console.log('[Button]:', button, 'Was Pressed')
      } //end of if



    }
    catch (e) { console.error(e); }
  });
});
