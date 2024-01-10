const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const userAuth = require('../middleware/userAuth');
const User = require('../models/User');

router.get('/hi', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ message: `Hello ${req.user.name}`, user: { userId: user._id, name: user.name } });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/new', async (req, res) => {
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

router.post('/login', async (req, res) => {
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

router.get('/logout', async (req, res) => {
    res.cookie('authToken', '', { maxAge: 10, httpOnly: true });
    res.status(200).json({ message: "User logged out successfully" });
});

router.get('/profile/:userId', userAuth, async (req, res) => {
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

router.get('/myprofile', userAuth, async (req, res) => {
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

router.get('/myhistory', userAuth, async (req, res) => {
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

router.get('/rankings', userAuth, async (req, res) => {
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


/*
// Verify the user, and send back his details 
app.get('/user/hi', userAuthentication, (req, res) => {

});

// Create new User
app.post('/user/new', async (req, res) => {

});

// Login the user and send token as cookie
app.post('/user/login', async (req, res) => {

});

// logout and send empty cookie
app.get('/user/logout', (req, res) => {

});
// get the user details by his id
app.get('/users/:userId', userAuthentication, async (req, res) => {

});

// My Profile
app.get('/user/myprofile', userAuthentication, async (req, res) => {

});

// get the user's quiz history by his id
app.get('/user/myhistory', userAuthentication, async (req, res) => {

});

// Get the rankings of all users
app.get('/user/rankings', userAuthentication, async (req, res) => {

});
*/


module.exports = router;
