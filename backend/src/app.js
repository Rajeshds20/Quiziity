const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/userRoute');
const quizRoute = require('./routes/quizRoute');
const questionRoute = require('./routes/questionRoute');
const openQuizRoute = require('./routes/openQuizRoute');

// Import Middleware
const userAuthentication = require('./middleware/userAuth');
const connectDB = require('./db/connect');

dotenv.config();

// Connect to DB
connectDB(process.env.DB_CONNECT);

const port = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:5173', // Allow requests from this origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get('/', (req, res) => res.send('Server running for Quiziity App...'));

// Add Routes
app.use('/user', userRoute);
app.use('/quiz', quizRoute);
app.use('/question', questionRoute);
app.use('/openquiz', openQuizRoute);


app.listen(port, () => console.log(`Quiziity app listening on port ${port}!`));
