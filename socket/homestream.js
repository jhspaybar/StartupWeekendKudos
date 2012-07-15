module.exports = function(io) {
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
}