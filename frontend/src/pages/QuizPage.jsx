import React, { useState, useEffect } from 'react'
import { useUser } from '../config/UseUser';
import { useNavigate } from 'react-router-dom';
import LogoutNav from '../components/LogOutNav';
import Navbar from '../components/NavBar';
import '../assets/css/QuizPage.css';


const QuizPage = () => {

    const { user, loggedIn } = useUser();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const [historyLoading, setHistoryLoading] = useState(false);
    const [history, setHistory] = useState(null);

    const startNewQuiz = async () => {
        const response = await fetch(`${API_URL}/quiz/create`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        console.log(data);
        if (response.status === 200) {
            console.log("Quiz created");
            navigate(`/quiz/${data.quiz._id}`);
        }
        else {
            console.log("Quiz creation failed");
            alert("Quiz creation failed, try again later");
        }
    }

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setHistoryLoading(true);
                const response = await fetch(`${API_URL}/user/myhistory`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const data = await response.json();
                console.log(data);
                if (response.status === 200) {
                    console.log("History fetched");
                    setHistory(data.history);
                    setHistoryLoading(false);
                }
                else {
                    console.log("History fetch failed");
                    alert("History fetch failed, try again later");
                }
                setHistoryLoading(false);
            } catch (error) {
                console.error(error);
                setHistoryLoading(false);
            }
        }
        if (loggedIn) {
            fetchHistory();
        }
    }, [loggedIn]);


    return (
        <div className='quiz-options'>
            {
                loggedIn ? <Navbar />
                    : <LogoutNav />
            }
            <h1>Quiz Page</h1>
            <div className='native-quizzes' >
                <div className='native-quizzes-options'>
                    <div>
                        <h3>Start a new Random Tech Quiz</h3>
                        {
                            loggedIn ? <button onClick={startNewQuiz}>New Quiz</button>
                                : <button onClick={() => navigate('/login')}>New Quiz</button>
                        }
                    </div>
                    <div>
                        <h3>Join in an Existing Open Quiz</h3>
                        <button onClick={() => {
                            alert("Coming Soon");
                        }}>Join</button>
                    </div>
                    <div>
                        <h3>Create a new Open Quiz</h3>
                        <button onClick={() => {
                            alert("Coming Soon");
                        }}>Create</button>
                    </div>
                </div>
                <div className='quiz-history'>
                    <h3>Quiz History</h3>
                    {
                        loggedIn ?
                            <div>
                                <h4>Your History</h4>
                                {
                                    historyLoading ? <h4>Loading...</h4>
                                        : history ? history.map((quiz, index) => {
                                            return (
                                                <div key={index} className='quiz-history-item'>
                                                    <p>Score: {quiz.score}</p>
                                                    <p>Time Taken: {quiz.timeTaken}</p>
                                                    <p>Date: {quiz.created}</p>
                                                </div>
                                            )
                                        })
                                            : <h4>No History</h4>
                                }
                            </div>
                            : <h4>Login To view History</h4>
                    }
                </div>
            </div>

        </div>
    )

}

export default QuizPage;
