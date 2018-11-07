const mongoose = require("mongoose");
const common = require("./common");


const SectionAdministration = new mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    discord: String,
    slack: String,
    officeHoursTime: {
        required: true,
        type: common.TimeInPeriods,
    },
    officeHoursLocation: {
        required: true,
        type: common.UFLocation
    }
});

module.exports = mongoose.model("Faculty", new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    courses: {
        type: [mongoose.Schema.Types.ObjectId],
        validate: {
            validator: v => {
                let s = new Set(v);
                return s.size === v.length;
            },
            message: props => `${props.value} does not contain all unique IDs`
        },
        required: true
    }
}));
