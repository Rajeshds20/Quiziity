import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../config/UseUser';
import QuizQuestion from '../components/QuizQuestion';
import QuizAnswer from '../components/QuizAnswer';
import NavBar from '../components/NavBar';
import LogoutNav from '../components/LogOutNav';

const PlayQuiz = () => {
    const { user, loggedIn } = useUser();
    const { quizId } = useParams();
    const API_URL = import.meta.env.VITE_API_URL;
    const [timer, setTimer] = useState(120);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [score, setScore] = useState(0);
    const [submittedAnswers, setSubmittedAnswers] = useState(null);
    const [started, setStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/quiz/details/${quizId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();
                if (response.status === 200) {
                    setQuiz(data.quiz);
                    setLoading(false);
                }
                else {
                    console.log("Quiz fetch failed");
                    setError(data.message);
                    setLoading(false);
                    setTimer(120);
                }
            } catch (error) {
                console.log("Quiz fetch failed", error.message);
                setError("Quiz fetch failed, try again later");
                setLoading(false);
            }
        }
        if (loggedIn) { fetchQuiz(); setError(null); }
        else setError("You need to login first");
    }, [loggedIn]);

    const handleSubmitQuiz = async (e) => {
        e.preventDefault();
        const answers = [];
        for (let i = 0; i < quiz.questions.length; i++) {
            answers.push(e.target[`question${i}`].value);
        }
        const score = quiz.questions.reduce((score, question, index) => {
            if (question.options[question.correct - 1] == answers[index]) {
                score += 1;
            }
            return score;
        }, 0);
        const response = await fetch(`${API_URL}/quiz/submit/${quizId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers, score })
        });
        const data = await response.json();
        if (response.status === 200) {

            console.log("Quiz submitted");
            setScore(data.score);
            setSubmittedAnswers(answers);
            setSubmitted(true);
        }
        else {
            console.log("Quiz submission failed");
            alert("Quiz submission failed, try again later");
        }
    }

    const handleTimeUpSubmit = async (el) => {
        const answers = [];
        for (let i = 0; i < quiz.questions.length; i++) {
            answers.push(formRef.current[`question${i}`].value);
        }
        console.log(answers, quizId);
        const score = quiz.questions.reduce((score, question, index) => {
            if (question.options[question.correct - 1] == answers[index]) {
                score += 1;
            }
            return score;
        }, 0);
        const response = await fetch(`${API_URL}/quiz/submit/${quizId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers, score })
        });
        const data = await response.json();
        if (response.status === 200) {

            console.log("Quiz submitted");
            setScore(data.score);
            setSubmittedAnswers(answers);
            setSubmitted(true);
        }
        else {
            console.log("Quiz submission failed");
            alert("Quiz submission failed, try again later");
        }
    }

    const startQuiz = () => {
        setStarted(true);
        setTimer(() => {
            let time = 120;
            const interval = setInterval(() => {
                time -= 1;
                setTimer(time);
                if (time === 0) {
                    clearInterval(interval);
                    handleTimeUpSubmit();
                }
            }, 1000);
            return time;
        });
    }

    return (
        <div style={{ margin: '10px', width: '100vw', textAlign: 'center' }}>
            {/* Add from attrtibute to redirect easily */}
            {
                loggedIn ? <NavBar /> : <LogoutNav from={`quiz/${quizId}`} />
            }
            {
                started ?
                    submitted ? (<div>
                        <h1 style={{ color: 'green' }}>Quiz Submitted Successfully</h1>
                        <h1>{quiz._id}</h1>
                        <h3>Score: {score}</h3>
                        <h3>Submitted Answers:</h3>
                        {
                            submittedAnswers.map((answer, index) =>
                                <QuizAnswer answer={answer} index={index} quiz={quiz} />
                            )
                        }
                    </div>)
                        : loading ? <h1>Loading...</h1>
                            : error ? <h1>{error}</h1>
                                : quiz ?
                                    <div>
                                        <h1>Quiz :</h1>
                                        <h2>Time Left: {timer}</h2>
                                        <form ref={formRef} onSubmit={handleSubmitQuiz}>
                                            {
                                                quiz.questions.map((question, index) =>
                                                    <QuizQuestion key={index} question={question} index={index} />
                                                )
                                            }
                                            <button type="submit">Submit</button>
                                        </form>
                                    </div>
                                    : null
                    : <button onClick={startQuiz}>Start Quiz</button>
            }
        </div>
    );
};

export default PlayQuiz;
