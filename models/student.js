const mongoose = require('mongoose');

module.exports = mongoose.model('Student', new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    coursesEnrolled: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
}));
