#!/usr/bin/env node
// ngrok http 3000




var title = '登入';
var socket = require('socket.io');
var request = require('request');

/*** Module dependencies.*/
var app = require('./app');
var debug = require('debug')('nodejs-auth:server');
var http = require('http');
/*** Get port from environment and store in Express.*/
var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);
/*** Create HTTP server.*/
var server = http.createServer(app);
/*** Listen on provided port, on all network interfaces.*/
server.listen(port, function () {
  console.log("listen to "+port);
});


var io = socket(server);
io.on('connection', function (socket) {
  socket.on("script", function (script) {
    //從伺服端拿到script的資訊
    //內容有：
    //input: "some input"
    //language: "程式語言"
    //script: "程式碼""
    console.log(script);
    console.log("--------------------");
    sendScriptToApi(script.script, script.input, script.language, socket);

  })
})

var apikey=[
   // 賀淋_a9
    { clientId:"7396cf893d492bde69303506411ff238",
    clientSecret: "5f567b1102df0329c0333e3c29ca8df1231fead27ae8be5f225cd0b0127549ba"},
    //賀淋_0551085
    { clientId:"4afe1a62e03936b375fcba723f89861f",
    clientSecret: "ba06a43d80b4a11d1541e3b6af11c7927f3de7ef409d062ed7a9fdc1959fdb69"},
    //賀淋_F109110106
    { clientId:"aa1584a8a8b2e324ee9f684113757a86",
    clientSecret: "2ee9d08f33a19a50fccce9a5765ec5819277d7286140acaadd8c234e9ee2b55d"},
    //冠宏
    { clientId:"af4806527eea73c9f3a098cef0598d58",
    clientSecret: "9e0e931b1de4bd367589f4ee2ad31939fbd4ae58cd1aa0eceebd7b4c38679ba0"},
    //亭貞
    { clientId:"1c613f9b7a81ecafaafcda3d84a062a4",
    clientSecret: "5c64185b9384348f29ceee6d4ceb36b54aa474365e2687f7a34b47b22555f50b"},
  ]

function getRandom(x){
    return Math.floor(Math.random()*x);
};

var sendScriptToApi = function (script, input, language, socket) {
  var index=getRandom(apikey.length)
  var clientId=apikey[index].clientId
  var clientSecret=apikey[index].clientSecret
  var program = {
    stdin: input,
    script: script,
    language: language,
    versionIndex: "0",
    clientId:clientId,
    clientSecret:clientSecret

  };
  var answer = {
    error: "",
    statusCode: "",
    body: ""
  }
  request({
    url: 'https://api.jdoodle.com/execute',
    method: "POST",
    json: program
  },
    function (error, response, body) {
      answer.error = error;
      answer.statusCode = response;
      answer.body = body;
      socket.emit('answer', answer);
    });
}



server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
