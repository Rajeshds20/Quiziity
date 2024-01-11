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
    created: {
        type: Date,
        default: Date.now,
    },
    timeTaken: {
        type: Number,
        default: 0,
    },
    submittedAnswers: [
        {
            type: String,
            required: true,
        }
    ],
});

const quizModel = mongoose.model('Quiz', quizSchema);

module.exports = quizModel;