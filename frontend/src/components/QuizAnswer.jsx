import React from 'react';
import ReactMarkdown from 'react-markdown';
import '../assets/css/QuizAnswer.css';

function QuizAnswer({ quiz, answer, index }) {
    return (
        <div className="quiz-answer-container" key={index}>
            <h4>{index + 1}. {quiz.questions[index].question}</h4>
            <p className={`answer-status ${answer ? 'submitted' : 'not-submitted'}`}>
                Selected: {answer ? answer : 'Not Submitted'}
            </p>
            <p>Correct Answer: {quiz.questions[index].options[quiz.questions[index].correct]}</p>
            <div className="explanation">
                Explanation: <ReactMarkdown children={quiz.questions[index].explanation} />
            </div>
        </div>
    );
}

export default QuizAnswer;
