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
