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
    app.get(leadingPath + '/:id', model.httpGet());
}

registerCRUDRoutes(require('./models/course_section'), 'course_section');
registerCRUDRoutes(require('./models/faculty'), 'faculty');
registerCRUDRoutes(require('./models/student'), 'student');

app.put('/api/student/:student_id/add_course/:section_id', (req, res) => {
    const Student = require("./models/student");
    const CourseSection = require("./models/course_section");
    CourseSection.findOne({
        sectionNumber: req.params.section_id
    }, (err, section) => {
        if (err) return res.status(400).send(err);
        console.log(section);
        Student.findOneAndUpdate({
            _id: req.params.student_id,
        }, {
            $push: {
                coursesEnrolled: section._id
            }
        }, (err) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send("Course added");
        });
    });
});

app.put('/api/student/:student_id/drop_course/:section_id', (req, res) => {
    const Student = require("./models/student");
    const CourseSection = require("./models/course_section");
    CourseSection.findOne({
        sectionNumber: req.params.section_id
    }, (err, section) => {
        if (err) return res.status(400).send(err);
        console.log(section);
        Student.findOneAndUpdate({
            _id: req.params.student_id,
        }, {
            $pullAll: {
                coursesEnrolled: [section._id]
            }
        }, (err) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send("Course added");
        });
    });
});

app.get('/api/detailed_section/:sectionNumber', (req, res) => {
    const Faculty = require('./models/faculty');
    const CourseSection = require('./models/course_section');
    CourseSection.findOne({sectionNumber: req.params.sectionNumber}, (err, section) => {
        if (err) return res.status(400).send(err);
        Faculty.find({courses: section._id}, (err, admins) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send({
                admins,
                section
            });
        });
    });
});

app.use(express.static('client'));
app.use(express.static('../Find-My-TA'));
console.log(`Starting server on port ${serverPort}`);
app.listen(serverPort);

