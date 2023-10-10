const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email',
        ],
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    quizzes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
        }
    ],
    joined: {
        type: Date,
        default: Date.now,
    },
    level: {
        type: Number,
        default: 1,
    },
    exp: {
        type: Number,
        default: 0,
    },
    avgscore: {
        type: Number,
        default: 0,
    },
    quizCount: {
        type: Number,
        default: 0,
    },
});

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;