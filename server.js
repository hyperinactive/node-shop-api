// setup a server, defualt port
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
// pass Express app as a handler to create a server
const server = http.createServer(app);

server.listen(port);
