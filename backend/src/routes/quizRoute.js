const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/userAuth');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const User = require('../models/User');

router.get('/create', userAuth, async (req, res) => {
    try {
        const questions = await Question.find();
        if (!questions) {
            return res.status(404).json({ message: "No questions found" });
        }

        const user = req.user;

        // Pick 10 random questions
        const randomQuestions = [];
        const randomIndices = [];
        while (randomQuestions.length < 10) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex);
                randomQuestions.push(questions[randomIndex]);
            }
        }

        const quiz = await Quiz({
            questions: randomQuestions,
            user: req.user._id,
        });
        await quiz.save();

        user.quizzes.push(quiz._id);
        user.quizCount += 1;
        await user.save();

        res.json({ message: "Quiz created successfully", quiz });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/details/:quizId', userAuth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate('questions user');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.json({ message: "Quiz found", quiz });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/submit/:quizId', userAuth, async (req, res) => {
    try {
        // const quiz = await Quiz.findById(req.params.quizId).populate('questions');
        const quiz = await Quiz.findOneAndUpdate(
            { _id: req.params.quizId, user: req.user._id },
            {
                $set: {
                    score: req.body.score,
                    submittedAnswers: req.body.answers.map(answer => answer === "" ? "Not Submitted" : answer)
                }
            },
            { new: true }
        ).populate('questions');

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (quiz.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not allowed to submit this quiz." });
        }
        const { answers, score } = req.body;
        if (!answers || score === null) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        // const score = quiz.questions.reduce((score, question, index) => {
        //     if (question.correct == answers[index]) {
        //         score += 1;
        //     }
        //     return score;
        // }, 0);

        // quiz.score = score;

        // Replace empty string answers with 'Not Submitted'
        // for (let i = 0; i < answers.length; i++) {
        //     if (answers[i] === "") {
        //         answers[i] = "Not Submitted";
        //     }
        // }

        // await quiz.save();

        // quiz.submittedAnswers = answers;
        // await quiz.save();
        // console.log(quiz);

        const user = await User.findById(quiz.user);
        // Add score based exp to user for 100 base
        user.exp += score * 10;
        // Set level to greater 1000 mark
        user.level = Math.floor(user.exp / 1000) + 1;
        // Adjust avg score
        const totalQuizzes = user.quizCount;
        user.avgscore = (user.avgscore * (totalQuizzes - 1) + score) / totalQuizzes;
        await user.save();

        res.json({ message: "Quiz submitted successfully", score });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

/*


// Create new quiz for the user
app.get('/quiz/create', userAuthentication, async (req, res) => {
    
});

// Get quiz details by its id
app.get('/quiz/details/:id', userAuthentication, async (req, res) => {
    
});

// Submit quiz answers and calculate score
app.post('/quiz/:quizId', userAuthentication, async (req, res) => {
    
});

*/

module.exports = router;
