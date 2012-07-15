var redisSub;
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  redisSub = require("redis").createClient(rtg.port, rtg.hostname);

  redisSub.auth(rtg.auth.split(":")[1]);
} else {
  redisSub = require("redis").createClient();
}

module.exports = function(io) {
  io.sockets.on('connection', function (socket) {
    // Listen on kudostream
    redisSub.subscribe('kudostream');
    
    // Publish new kudos on the channel
    redisSub.on('message', function(channel, message) {
      //var data = eval('(' +message+ ')');
      socket.emit('kudostream', message);
    });
  });
}