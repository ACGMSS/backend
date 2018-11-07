const mongoose = require('mongoose');
const Faculty = require("../models/faculty");

describe("Faculty", function () {
    describe("#save", function () {
        it("should not save if there are duplicate IDs", function(done) {
            let objID = mongoose.Types.ObjectId();
            let f = new Faculty({
                name: "foobar",
                email: "ok@thisisepic.com",
                courses: [objID, objID],
                social: {},
                password: "pwease encrypt o3o"
            });
            f.save(function (err) {
                let fieldsWithErrors = Object.keys(err.errors);
                let isErrorExpected =
                    fieldsWithErrors.length === 1 &&
                    fieldsWithErrors[0] === "courses" &&
                    err.errors.courses.message.indexOf("does not contain all unique IDs") !== -1;
                if (isErrorExpected) {
                    Faculty.deleteOne(f, function(err) {
                        if (err) done(err);
                        else done();
                    });
                }
                else done(err);
            });
        });
    });
});
