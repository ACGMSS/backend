const mongoose = require('mongoose');

before(function () {
    mongoose.connect('mongodb://localhost/test');
});

after(() => {
    mongoose.disconnect();
});
