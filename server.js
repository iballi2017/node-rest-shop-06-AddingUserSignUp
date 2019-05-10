const http = require('http');

//import app
const app = require('./app');
const mobile = require('./mobile');
// const products = require('./api/routes/products');


const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port);