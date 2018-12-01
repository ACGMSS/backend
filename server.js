require('dotenv').config();

const serverPort = process.env.PORT || 3000;
const express = require('express');
const morgan = require('morgan');
const crud = require('crud-mongoose-simple');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/local');
mongoose.plugin(crud);
var bodyParser = require('body-parser');
const Student = require('./models/student');
const Faculty = require('./models/faculty');
const CourseSection = require('./models/course_section');

const app = express();
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(express.static('./Find-My-TA'));
app.use(maybeAuthorize);
function maybeAuthorize(req, res, next) {
    const basicAuth = require('express-basic-auth');
    const allowedRoutes = {
        POST: ['/api/faculty',
               '/api/faculty_login',
               '/api/student_login',
               '/api/student']
    };
    let routesForMethod = allowedRoutes[req.method] || [];
    if (routesForMethod.indexOf(req.path) != -1) {
        next();
    } else {
        basicAuth({
            authorizer: accountLookupForAuth,
            authorizeAsync: true
        })(req, res, next);
    }
}

function accountLookupForAuth(uname, pw, cb) {
    Student.findOne({
        email: uname,
        password: pw,
    }, (err, student) => {
        if (err) cb(err, false);
        else if (student) cb(err, true);
        else {
            Faculty.findOne({
                email: uname,
                password: pw,
            }, (err, faculty) => {
                if (err) cb(err, false);
                else if (faculty) cb(err, true);
                else cb(err, false);
            });
        }
    });
}

function registerCRUDRoutes(model, leadingPathNoSlash) {
    let leadingPath = '/api/' + leadingPathNoSlash;
    app.get(leadingPath + '/list', model.httpGet());
    app.post(leadingPath, model.httpPost());
    app.get(leadingPath + '/:id', model.httpGet());
}

app.put('/api/faculty/:id', (req, res) => {
    Faculty.update({
        _id: req.params.id
    }, req.body, (err) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send("Faculty updated");
    });
});

app.post('/api/course_section/upsert', (req, res) => {
    CourseSection.findOne({
        sectionNumber: req.body.sectionNumber,
    }, (err, section) => {
        if (err) return res.status(400).send(err);
        if (section) return res.status(200).send(section._id);
        CourseSection.create(req.body, (err, section) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(section._id);
        });
    });
});

registerCRUDRoutes(CourseSection, 'course_section');
registerCRUDRoutes(Faculty, 'faculty');
registerCRUDRoutes(Student, 'student');

app.put('/api/student/:student_id/add_course/:section_id', (req, res) => {
    CourseSection.findOne({
        sectionNumber: req.params.section_id
    }, (err, section) => {
        if (err) return res.status(400).send(err);
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
    CourseSection.findOne({
        sectionNumber: req.params.section_id
    }, (err, section) => {
        if (err) return res.status(400).send(err);
        Student.findOneAndUpdate({
            _id: req.params.student_id,
        }, {
            $pullAll: {
                coursesEnrolled: [section._id]
            }
        }, (err) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send("Course dropped");
        });
    });
});

app.get('/api/detailed_section/:sectionNumber', (req, res) => {
    CourseSection.findOne({sectionNumber: req.params.sectionNumber}, (err, section) => {
        if (err) return res.status(400).send(err);
        Faculty.find({}, (err, allAdmins) => {
            if (err) return res.status(400).send(err);
            let admins = allAdmins.filter(admin => {
                let taughtSectionNumbers = admin.courses.map(c => c.section.toString());
                return taughtSectionNumbers.indexOf(section._id.toString()) !== -1;
            });
            admins = admins.map(x => {
                let course = x.courses.filter(course => {
                    return course.section.toString() === section._id.toString();
                })[0];
                return {
                    _id: x._id,
                    name: x.name,
                    email: x.email,
                    officeHoursTimes: course.officeHoursTimes,
                    officeHoursLocation: course.officeHoursLocation
                };
            });
            return res.status(200).send({
                admins,
                section
            });
        });
    });
});

app.post('/api/student_login', (req, res) => {
    Student.find({
        email: req.body.username,
        password: req.body.password,
    }, (err, students) => {
        if (err) return res.status(400).send(err);
        else if (students.length === 0) return res.status(400).send("No matching students");
        else return res.status(200).send(students[0]);
    });
});

app.post('/api/faculty_login', (req, res) => {
    Faculty.find({
        email: req.body.username,
        password: req.body.password,
    }, (err, faculty) => {
        if (err) return res.status(400).send(err);
        else if (faculty.length === 0) return res.status(400).send("No matching faculty");
        else return res.status(200).send(faculty[0]);
    });
});

app.put('/api/faculty/:faculty_id/manage_course', (req, res) => {
    CourseSection.findOne({
        sectionNumber: req.body.section
    }, (err, section) => {
        if (err) return res.status(400).send(err);
        Faculty.findOneAndUpdate({
            _id: req.params.faculty_id,
        }, {
            $push: {
                courses: {
                    section: section._id,
                    discord: req.body.discord,
                    slack: req.body.slack,
                    officeHoursTimes: req.body.officeHoursTimes,
                    officeHoursLocation: req.body.officeHoursLocation
                }
            }
        }, (err) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send("Course added");
        });
    });
});

app.put('/api/faculty/:faculty_id/drop_course/:course_id', (req, res) => {
    Faculty.findOneAndUpdate({
        _id: req.params.faculty_id,
    }, {
        $pull: {
            courses: {
                section: req.params.course_id
            }
        }
    }, (err) => {
        if (err) return res.status(400).send(err);
        return res.status(200).send("Course dropped");
    });
});

console.log(`Starting server on port ${serverPort}`);
app.listen(serverPort);

