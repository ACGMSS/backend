const mongoose = require('mongoose');

const PeriodsForDay = {
    type: [Number],
    required: true,
    validate: {
        validator: v => {
            return v.filter(Number.isInteger).length === v.length;
        },
        message: props => `${props.value} does not contain all integers`
    }
};

module.exports.TimeInPeriods = new mongoose.Schema({
    monday:  PeriodsForDay,
    tuesday:  PeriodsForDay,
    wednesday:  PeriodsForDay,
    thursday:  PeriodsForDay,
    friday:  PeriodsForDay,
});


const UFBuildingLocation = new mongoose.Schema({
    googleMapsLatitude: {
        type: String,
        required: true,
    },
    googleMapsLongitude: {
        type: String,
        required: true,
    }
});

module.exports.UFLocation = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
    },
    buildingLocation: {
        require: true,
        type: UFBuildingLocation
    }
});
