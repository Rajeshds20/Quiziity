const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        }
    ],
    score: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    score: {
        type: Number,
        default: 0,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    submittedAnswers: [
        {
            type: String,
        }
    ],
});

const quizModel = mongoose.model('Quiz', quizSchema);

module.exports = quizModel;