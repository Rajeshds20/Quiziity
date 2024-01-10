const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Import Models
const Question = require('./models/Question');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const OpenQuiz = require('./models/OpenQuiz');
const OpenQuizRes = require('./models/OpenQuizRes');

// Import Middleware
const userAuthentication = require('./middleware/userAuth');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(() => console.log('Connected to DB!')).catch(err => console.log(err));

const port = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/', (req, res) => res.send('Server running for Quiz App...'));

// Verify the user, and send back his details 
app.get('/user/hi', userAuthentication, (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ message: `Hello ${req.user.name}`, user: { userId: user._id, name: user.name } });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new User
app.post('/user/new', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User({
            email,
            password: hashedPassword,
            name
        });

        await newUser.save();

        // Generate a JWT for user authentication
        const authToken = jwt.sign({ id: newUser._id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: '2d' });

        res.cookie('authToken', authToken, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.json({ message: "User created successfully", userId: newUser._id });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Login the user and send token as cookie
app.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const authToken = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '2d' });
        res.cookie('authToken', authToken, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.json({ message: "User logged in successfully", userId: user._id });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// logout and send empty cookie
app.get('/user/logout', (req, res) => {
    res.cookie('authToken', '', { maxAge: 10, httpOnly: true });
    res.status(200).json({ message: "User logged out successfully" });
});

// Create new quiz for the user
app.get('/quiz/create', userAuthentication, async (req, res) => {
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

// Get quiz details by its id
app.get('/quiz/details/:id', userAuthentication, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('questions user');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.json({ message: "Quiz found", quiz });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit quiz answers and calculate score
app.post('/quiz/:quizId', userAuthentication, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (quiz.user !== req.user._id) {
            return res.status(403).json({ message: "You are not allowed to submit this quiz." });
        }
        const { answers } = req.body;
        if (!answers) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const score = quiz.questions.reduce((score, question, index) => {
            if (question.correct == answers[index]) {
                score += 1;
            }
            return score;
        }, 0);

        quiz.score = score;
        quiz.submittedAnswers = answers;
        await quiz.save();

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
        res.status(500).json({ message: err.message });
    }
});

// get the user details by his id
app.get('/users/:userId', userAuthentication, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User found", user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err.message);
    }
});

// My Profile
app.get('/user/myprofile', userAuthentication, async (req, res) => {
    try {
        const user = req.user;
        // remove passwords from user object
        const profile = await User.findById(user._id).populate('quizzes');
        profile.password = undefined;
        res.json({ message: "User found", profile });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get the user's quiz history by his id
app.get('/user/myhistory', userAuthentication, async (req, res) => {
    try {
        const user = req.user;
        const userhistory = await User.findOne({ _id: user._id }).populate('quizzes');
        if (!userhistory.quizzes) {
            return res.status(404).json({ message: "History not found" });
        }
        const count = userhistory.quizzes.length;
        res.json({ message: "History found", count, history: userhistory.quizzes });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get the rankings of all users
app.get('/user/rankings', userAuthentication, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const users = await User.find({})
        const totalCount = users.length;
        // Get the limit of users in page in sorted order of exp and avg score
        users.sort((a, b) => {
            if (a.exp == b.exp) {
                return b.avgscore - a.avgscore;
            }
            return b.exp - a.exp;
        });
        users.splice(limit * (page - 1), limit);

        if (!users) {
            return res.status(404).json({ message: "Users not found" });
        }

        const usersRankData = users.map((user, index) => {
            return {
                name: user.name,
                email: user.email,
                level: user.level,
                quizCount: user.quizCount,
                rank: index + 1,
                exp: user.exp,
                avgscore: user.avgscore,
            };
        });

        res.json({ message: "Users Ranked", users: usersRankData, totalCount });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// To create or add new questions
app.post('/questions/add', async (req, res) => {
    try {
        const { question, options, correct, explanation } = req.body;

        if (!question || !options || !correct || !explanation) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const newQuestion = await Question({
            question,
            options,
            correct,
            explanation,
        });

        await newQuestion.save();
        res.json({ message: "Question created successfully", questionId: newQuestion._id });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// To Create New Open Quiz
app.post('/openquiz/create', userAuthentication, async (req, res) => {
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

app.get('/openquiz/:quizCode', async (req, res) => {
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

app.post('/openquiz/:quizCode/submit', async (req, res) => {
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

app.get('/openquiz/:quizCode/results', userAuthentication, (req, res) => {
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


// Function to calculate results for a single response
const calculateScoreForResponse = (openQuiz, openQuizRes) => {
    let score = 0;
    // Iterate through each question in the quiz
    openQuiz.questions.forEach((question, index) => {
        const correctAnswer = question.answer;
        const userAnswer = openQuizRes.answers[index];

        // Check if the user's answer is correct and update the score
        score += question.options[correctAnswer] === question.options[userAnswer] ? 1 : 0;
    });
    return score;
};

// Function to calculate scores for all responses and generate a sorted leaderboard
const generateLeaderboard = (openQuiz, openQuizResArray) => {
    const leaderboard = [];

    // Calculate scores for each response
    openQuizResArray.forEach((openQuizRes) => {
        const score = calculateScoreForResponse(openQuiz, openQuizRes);

        // Add response and score to the leaderboard
        leaderboard.push({
            response: openQuizRes._id, // Assuming _id is the ObjectId of the OpenQuizRes instance
            score: score,
        });
    });
    leaderboard.sort((a, b) => b.score - a.score);
    return leaderboard;
};

const codeGen = async () => {
    let code = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

const RecursiveCodeGen = async () => {
    const code = await codeGen();
    return await OpenQuiz.findOne({ code: code }).then((quiz) => {
        if (quiz) {
            return RecursiveCodeGen();
        }
        return code;
    });
}

app.listen(port, () => console.log(`Quiziity app listening on port ${port}!`));
