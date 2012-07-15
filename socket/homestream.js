var redisSub = require("redis").createClient();
var redisPub = require("redis").createClient();

module.exports = function(io) {
  io.sockets.on('connection', function (socket) {
    // Listen on kudostream
    redisSub.subscribe('kudostream');
    
    // Publish new kudos on the channel
    redisSub.on('message', function(channel, message) {
      var data = eval('(' +message+ ')');
      socket.emit('kudostream', data);
    });
  });
}