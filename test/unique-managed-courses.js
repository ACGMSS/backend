const Faculty = require("../models/faculty");

describe("Faculty", function () {
    describe("#save", function () {
        it("should not save if there are duplicate IDs", function(done) {
            let f = new Faculty({
                name: "foobar",
                email: "ok@thisisepic.com",
                courses: ["foo", "foo"]
            });
            f.save(function (err) {
                if (err) done(err);
                done();
            });
        });
    });
});
