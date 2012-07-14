/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/router')
  , http = require('http')
  , lessMiddleware = require('less-middleware')
  , mongoose = require('mongoose')
  , RedisStore = require('connect-redis')(express);
  /*
  *  Still need to properly connect on Heroku!
  */
  /*if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);

    redis.auth(rtg.auth.split(":")[1]);
  } else {
    var redis = require("redis").createClient();
  }*/

var app = express();

var connectionString = process.env.MONGOHQ_URL || 'mongodb://localhost/MassEducateDev'; //Get Heroku connection, or dev host...
mongoose.connect(connectionString); //Call only once in the application

app.configure(function(){
  app.set('views', __dirname + '/views'); //Define our views directory for express
  app.set('view engine', 'jade'); //Set our view engine to jade
  app.use(express.favicon()); //Serve a favicon
  app.use(express.logger('dev'));
  app.use(lessMiddleware({  //Less compiler 
    src: __dirname + '/less', //Source directory of less files
    dest: __dirname + '/public', //Destination directory for compiled css files
    debug: process.env.NODE_ENV === 'production' ? false : true, //Will generate 2 log lines per css file requested, ternary will be false in production
    compress: true
  }));
  app.use(express.static(__dirname + '/public')); //Serve static requests out of the /public directory
  app.use(express.bodyParser());
  app.use(express.cookieParser("some-secret"));//User cookies
  app.use(express.session({ secret: "recognize-dev", store: new RedisStore }));//Connect to redis for our sessions so we can scale horizontally
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes(app); //Pass the app object to our routes file to register all of our routes

var port = process.env.PORT || 3000;//Get Heroku required port, or dev host...
var server = http.createServer(app);//Start it all up!
var io = require('socket.io').listen(server);

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { kudo: 
    {
      message: 'TestMessage',
      user: 'bob'
    }
  });
  socket.on('getMore', function(data) {
    socket.emit('news', { kudo: 
      {
        message: 'TestMessage',
        user: 'bob'
      }
    });
  })
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

server.listen(port);

console.log("Express server listening on port " + port);//Log that our server has started to the console
