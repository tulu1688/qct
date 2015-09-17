var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quizsc');

module.exports = mongoose;