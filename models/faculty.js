const mongoose = require("mongoose");
const common = require("./common");

const OfficeHoursLocation = new mongoose.Schema({
    buildingName: {
        type: String,
        required: true,
    },
    buildingLatitude: {
        type: Number,
        required: true,
    },
    buildingLongitude: {
        type: Number,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
});

const SectionAdministration = new mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    discord: String,
    slack: String,
    officeHoursTime: {
        required: true,
        type: String,
    },
    officeHoursLocation: {
        required: true,
        type: OfficeHoursLocation
    },
});

const JobOpening = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hoursPerWeek: {
        type: Number,
        required: true,
    },
    payPerHour: {
        type: Number,
        required: true,
    }
});

const Social = new mongoose.Schema({
    twitterHandle: String,
    linkedinLink: String,
    rateMyProfessor: String,
});

module.exports = mongoose.model("Faculty", new mongoose.Schema({
    facultyType: {
        type: String,
        required: true,
        enum: ["Professor", "TA", "Researcher"]
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: v => {
                return v.endsWith("@ufl.edu");
            },
            message: props => `${props.value} does not end with ufl.edu`
        }
    },
    courses: {
        type: [SectionAdministration],
        validate: {
            validator: v => {
                let s = new Set(v.map(x => x.section));
                return s.size === v.length;
            },
            message: props => `${props.value} does not contain all unique IDs`
        },
        default: []
    },
    password: {
        type: String,
        required: true,
    },
    research: {
        type: String,
        default: "",
    },
    jobOpenings: {
        type: [JobOpening],
        default: [],
    },
    social: {
        type: Social,
        required: true,
    },
}));
