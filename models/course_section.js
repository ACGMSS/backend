const mongoose = require("mongoose");

const TermSchema = new mongoose.Schema({
    semester: {
        type: String,
        enum: ["Fall", "Spring", "Summer A", "Summer B", "Summer C"],
        required: true,
    },
    year: {
        type: Number,
        required: true,
        validate: {
            validator: v => Number.isInteger(v) && v >= 2018,
            message: props => `${props.value} is not a valid year starting in 2018`
        }
    }
});

module.exports = mongoose.model("CourseSection", new mongoose.Schema({
    sectionNumber: {
        type: String,
        unique: true,
        required: true
    },
    term: {
        type: TermSchema,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}));
