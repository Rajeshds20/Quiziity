import React, { useState, useEffect } from 'react'
import { useUser } from '../config/UseUser';
import { useNavigate } from 'react-router-dom';
import LogoutNav from '../components/LogOutNav';
import Navbar from '../components/NavBar';
import '../assets/css/QuizPage.css';


const QuizPage = () => {

    const { user, loggedIn } = useUser();
    const navigate = useNavigate();

    const startNewQuiz = () => {

    }

    useEffect(() => {
    }, []);

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
                        loggedIn ? <h4>Your History</h4> : <h4>Login To view History</h4>
                    }
                </div>
            </div>

        </div>
    )

}

export default QuizPage;
