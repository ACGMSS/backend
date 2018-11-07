const mongoose = require('mongoose');
const CourseSection = require("../models/course_section.js");

before(function () {
    mongoose.connect('mongodb://localhost/test');
});

after(() => {
    mongoose.disconnect();
});

describe("CourseSection", function () {
    describe("#save", function () {
        it("should save without error", function(done) {
            let cs = new CourseSection({
                name: "DUM1234",
                term: {
                    semester: "Fall",
                    year: 2018
                },
                sectionNumber: "123546"
            });
            cs.save(function (err) {
                if (err) done(err);
                else done();
            });
        });
    });
});
