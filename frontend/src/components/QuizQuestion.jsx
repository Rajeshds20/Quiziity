import React, { useEffect } from "react";
import '../assets/css/QuizQuestion.css'

function QuizQuestion({ question, index }) {
    return (
        <div className="quiz-question-container">
            <div className="quiz-question" key={question._id}>
                <h3>{index + 1}. {question.question}</h3>
                <div className="options-container">
                    {question.options.map((option, i) => (
                        <div className="option" key={i}>
                            <input
                                type="radio"
                                name={`question${index}`}
                                value={option}
                                id={`question${index}${i}`}
                            />
                            <label htmlFor={`question${index}${i}`}>{option}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuizQuestion;

