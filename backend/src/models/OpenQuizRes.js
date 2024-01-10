const mongoose = require('mongoose');

const openQuizResSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OpenQuiz',
    },
    userName: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    answers: [
        {
            type: String,
            required: true,
        }
    ],
    submitted: {
        type: Date,
        default: Date.now,
    },
});

const openQuizResModel = mongoose.model('OpenQuizRes', openQuizResSchema);
module.exports = openQuizResModel;