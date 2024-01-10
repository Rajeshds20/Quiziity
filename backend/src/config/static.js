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

// Generate Code for OpenQuizzes
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


// export the functions
module.exports = { RecursiveCodeGen, generateLeaderboard }
