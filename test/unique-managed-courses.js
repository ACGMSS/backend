const mongoose = require('mongoose');
const Faculty = require("../models/faculty");

describe("Faculty", function () {
    describe("#save", function () {
        it("should not save if there are duplicate IDs", function(done) {
            let objID = mongoose.Types.ObjectId();
            let f = new Faculty({
                name: "foobar",
                email: "ok@thisisepic.com",
                courses: [objID, objID]
            });
            f.save(function (err) {
                console.log(err.name);
                if (err.name === "ValidationError") {
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
