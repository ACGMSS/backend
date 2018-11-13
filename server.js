const serverPort = 3000;
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('tiny'));
app.use(express.static('client'));
console.log(`Starting server on port ${serverPort}`);
app.listen(serverPort);
