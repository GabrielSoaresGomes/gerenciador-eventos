const app = require('./app');
const env = require('./entity/environment-validation');
const http = require('http');
const debug = require('debug');
const databaseInitiator = require('./init-db');
databaseInitiator().then(() => {
    console.log('Banco de Dados iniciado!');
});

const PORT = env.getVar('PORT');
app.set('port', PORT);


const server = http.createServer(app);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string'
        ? 'Pipe ' + PORT
        : 'Port ' + PORT;

    // handle specific listen errors with friendly messages
    const EXIT_CODE = 1;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(EXIT_CODE);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(EXIT_CODE);
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
    debug('Listening on ' + bind);
    console.log(`Iniciando processo na PORTA: ${addr.port}`);
}

server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);