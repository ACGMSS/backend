const mongoose = require('mongoose');
const CourseSection = require("../models/course_section.js");

describe("CourseSection", function () {
    describe("#save", function () {
        it("should save without error", function(done) {
            let cs = new CourseSection({
                name: "DUM1234",
                term: {
                    semester: "Fall",
                    year: 2018
                },
                sectionNumber: "123546",
                meetingTime: {
                    monday: [],
                    tuesday: [1],
                    wednesday: [],
                    thursday: [7],
                    friday: [],
                },
                meetingLocation: {
                    roomNumber: "CSE440",
                    buildingLocation: {
                        googleMapsLatitude: "100",
                        googleMapsLongitude: "200",
                    }
                }
            });
            cs.save(function (err) {
                if (err) done(err);
                else {
                    CourseSection.deleteOne(cs, function (err) {
                        if (err) done(err);
                        else done();
                    });
                }
            });
        });
    });
});
