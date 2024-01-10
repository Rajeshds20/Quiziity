const mongoose = require('mongoose');

const openQuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    questions: [
        {
            question: {
                type: String,
                required: true,
            },
            options: [
                {
                    type: String,
                    required: true,
                },
            ],
            answer: {
                type: String,
                required: true,
            },
        }
    ],
    code: {
        type: String,
        required: true,
        unique: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    results: [
        {
            response: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'OpenQuizRes',
            },
            score: {
                type: Number,
                required: true,
            },
        }
    ]
});

const openQuizModel = mongoose.model('OpenQuiz', openQuizSchema);
module.exports = openQuizModel;