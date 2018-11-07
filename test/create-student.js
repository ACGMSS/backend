const Student = require('../models/student');

describe("Student", () => {
    describe("#save", () => {
        it("should be able to save a simple student", (done) => {
            const s = new Student({
                name: "Carlo Romo",
                email: "delebot@gmail.com",
                password: "iloveanime"
            });
            s.save((err) => {
                if (err) done(err);
                else {
                    Student.deleteOne(s, (err) => {
                        if (err) done(err);
                        else done();
                    });
                }
            });
        });
    });
});
