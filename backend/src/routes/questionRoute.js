const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

router.post('/add', async (req, res) => {
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

/*

To create or add new questions
app.post('/questions/add', async (req, res) => {

});
*/

module.exports = router