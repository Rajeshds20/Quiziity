const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const OpenQuiz = require('../models/OpenQuiz');
const OpenQuizRes = require('../models/OpenQuizRes');
const { RecursiveCodeGen, generateLeaderboard } = require('../config/static');

router.post('/create', userAuth, async (req, res) => {
    try {
        const { title, questions, startTime, duration } = req.body;

        if (!title || !questions || !startTime || !duration) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        // console.log(questions);
        const user = req.user;
        const newCode = await RecursiveCodeGen();
        const newOpenQuiz = await OpenQuiz({
            title,
            questions,
            creator: user._id,
            code: newCode,
            startTime,
            endTime: new Date(new Date().getTime() + 3000 + duration * 60000),
        });
        // console.log(newOpenQuiz);

        await newOpenQuiz.save();
        user.openQuizzes.push(newOpenQuiz._id);
        await user.save();
        res.json({ message: "Open Quiz created successfully", quizId: newOpenQuiz._id, quizCode: newCode });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:quizCode', async (req, res) => {
    try {
        const quiz = await OpenQuiz.findOne({ code: req.params.quizCode }).populate('creator');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.json({ message: "Quiz found", quiz });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:quizCode/submit', async (req, res) => {
    try {
        const { userName, answers } = req.body;
        if (!userName || !answers) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const quiz = await OpenQuiz.findOne({ code: req.params.quizCode });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const score = quiz.questions.reduce((score, question, index) => {
            if (question.answer == answers[index]) {
                score += 1;
            }
            return score;
        }, 0);

        const newOpenQuizRes = await OpenQuizRes({
            quiz: quiz._id,
            userName,
            answers,
            score
        });

        await newOpenQuizRes.save();
        res.json({ message: "Quiz submitted successfully", quizResId: newOpenQuizRes._id });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:quizCode/results', userAuth, async (req, res) => {
    try {
        const quizCode = req.params.quizCode;
        const user = req.user;
        if (!quizCode) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        OpenQuiz.findOne({ code: quizCode }).populate('creator').then((quiz) => {
            if (!quiz) {
                return res.status(404).json({ message: "Quiz not found" });
            }
            if (quiz.creator._id.toString() != user._id.toString()) {
                return res.status(403).json({ message: "You are not authorized to view this" });
            }

            OpenQuizRes.find({ quiz: quiz._id }).then(async (quizRes) => {
                if (quizRes.length == 0) {
                    return res.status(404).json({ message: "Quiz Results not found" });
                }
                else {
                    const leaderboard = generateLeaderboard(quiz, quizRes);
                    quiz.results = leaderboard;
                    await quiz.save();
                    return res.status(200).json({ message: "Quiz Results", quizResults: quiz });
                }
            }).catch((err) => {
                res.status(500).json({ message: err.message });
            });
        }).catch((err) => {
            res.status(500).json({ message: err.message });
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});


/*

To Create New Open Quiz
app.post('/openquiz/create', userAuthentication, async (req, res) => {
    
});

To get details of OpenQuiz
app.get('/openquiz/:quizCode', async (req, res) => {
    
});

To Submit the openQuiz
app.post('/openquiz/:quizCode/submit', async (req, res) => {
    
});

To see the results of OpenQuiz
app.get('/openquiz/:quizCode/results', userAuthentication, (req, res) => {
    
});
*/

module.exports = router;