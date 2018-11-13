const serverPort = 3000;
const express = require('express');
const morgan = require('morgan');
const crud = require('crud-mongoose-simple');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/test");
mongoose.plugin(crud);
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny'));

function registerCRUDRoutes(model, leadingPathNoSlash) {
    let leadingPath = '/api/' + leadingPathNoSlash;
    app.get(leadingPath + '/list', model.httpGet());
    app.post(leadingPath, model.httpPost());
}

registerCRUDRoutes(require('./models/course_section'), 'course_section');
registerCRUDRoutes(require('./models/faculty'), 'faculty');
registerCRUDRoutes(require('./models/student'), 'student');

app.use(express.static('client'));
app.use(express.static('../Find-My-TA'));
console.log(`Starting server on port ${serverPort}`);
app.listen(serverPort);

