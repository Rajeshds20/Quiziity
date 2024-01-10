import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../config/UseUser';

const PlayQuiz = () => {
    const [quizInfo, setQuizInfo] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [timer, setTimer] = useState(60);
    // Route param id
    const quizId = useParams().id;
    console.log(quizId);

    const { user, loggedIn } = useUser();

    useEffect(() => {
        if (!loggedIn) {
            return;
        }
        // Fetch quiz info from API
        const fetchQuizInfo = async () => {
            try {
                const response = await fetch('http://localhost:5000/quiz/details/659d27a69144ba094bc33891');
                const data = await response.json();
                setQuizInfo(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchQuizInfo();
    }, [loggedIn]);

    useEffect(() => {
        // Start the timer
        const countdown = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        // Auto submit when timer hits 0
        if (timer === 0) {
            submitQuiz();
        }

        // Clean up the interval
        return () => clearInterval(countdown);
    }, [timer]);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const submitQuiz = () => {
        // Submit the quiz with selected options
        // You can send the selected options to the server for evaluation

        // Reset the state
        setCurrentQuestion(0);
        setSelectedOption('');
        setTimer(60);
    };

    if (!quizInfo || (!quizInfo.questions || quizInfo.questions.length === 0)) {
        return <div>Loading...</div>;
    }
    const { questions } = quizInfo;

    return (
        <div>
            <h1>Play Quiz</h1>
            <div>
                <h2>Question {currentQuestion + 1}</h2>
                <p>{questions[currentQuestion].question}</p>
                <ul>
                    {questions[currentQuestion].options.map((option, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type="radio"
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={() => handleOptionChange(option)}
                                />
                                {option}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <p>Time Remaining: {timer} seconds</p>
                <button onClick={submitQuiz}>Submit</button>
            </div>
        </div>
    );
};

export default PlayQuiz;
