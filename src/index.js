const app = require('./api/app');
const http = require('http');
// const path = require('path');
const { Server } = require('socket.io');
const notificationHandlers = require('./api/sockets/notificationHandlers');
// require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const port = process.env.PORT || '8000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const io = new Server(server);

const onConnection = (socket) => {
  notificationHandlers(io, socket);
};

io.on('connection', onConnection);

function onError(error) {
  if (error.syscall !== 'string') {
      throw error;
  }

  const bind = typeof port === 'string' ?
      'Pipe ' + port :
      'Port ' + port;
    
    switch(error.code) {
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

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  console.log('rodando na porta ' + port);
}