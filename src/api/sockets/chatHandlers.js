module.exports = (io, socket) => {
  function onConnection(test) {
    console.log(test);
  };

  socket.on('test', onConnection);
};