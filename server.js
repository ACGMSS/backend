const serverPort = 3000;
const express = require('express');
const morgan = require('morgan');
const crud = require('crud-mongoose-simple');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/test");
mongoose.plugin(crud);
const CourseSectionModel = require('./models/course_section');

const app = express();

app.use(morgan('tiny'));

function registerCRUDRoutes(model, leadingPathNoSlash) {
    let leadingPath = '/' + leadingPathNoSlash;
    app.get(leadingPath + '/list', model.httpGet());
    app.post(leadingPath, model.httpPost());
}

registerCRUDRoutes(CourseSectionModel, 'course_section');

app.use(express.static('client'));
console.log(`Starting server on port ${serverPort}`);
app.listen(serverPort);

