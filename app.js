/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/router')
  , homeStream = require('./socket/homestream')
  , http = require('http')
  , https = require('https')
  , lessMiddleware = require('less-middleware')
  , mongoose = require('mongoose')
  , RedisStore = require('connect-redis')(express);

var app = express();

app.configure('production', function () {
  var redisUrl = require("url").parse(process.env.REDISTOGO_URL);
  var redisAuth = redisUrl.auth.split(':');  
  app.set('redisHost', redisUrl.hostname);
  app.set('redisPort', redisUrl.port);
  app.set('redisDb', redisAuth[0]);
  app.set('redisPass', redisAuth[1]);
});

var connectionString = process.env.MONGOHQ_URL || 'mongodb://localhost/Recognize'; //Get Heroku connection, or dev host...
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
  app.use(express.session({
    secret: 'recognize-dev',
    store: new RedisStore({
      host: app.set('redisHost'),
      port: app.set('redisPort'),
      db: app.set('redisDb'),
      pass: app.set('redisPass')
    })
  }));//Connect to redis for our sessions so we can scale horizontally
  app.use(express.methodOverride());
  app.use(app.router);

  app.locals.use(function(req, res) {
    app.locals.session = req.session;
    app.locals.isProduction = process.env.NODE_ENV === 'production';
    console.log('Using production api key: ' + app.locals.isProduction);
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes(app); //Pass the app object to our routes file to register all of our routes

var port = process.env.PORT || 3000;//Get Heroku required port, or dev host...
var server = http.createServer(app);//Start it all up!

var io = require('socket.io').listen(server); //create our socket server

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});//Configure our sockets

homeStream(io);

server.listen(port);

console.log("Express server listening on port " + port);//Log that our server has started to the console
