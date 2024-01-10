/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../config/UseUser';
import NavBar from '../components/NavBar';
import LogoutNav from '../components/LogOutNav';

import '../assets/css/HomePage.css'

export default function HomePage() {

    const navigate = useNavigate();
    // const API_URL = import.meta.env.VITE_API_URL;

    const { user, loggedIn } = useUser();

    useEffect(() => {
        if (!loggedIn) {
            // navigate('/login');
        }
        // console.log("User :", user, user.name);
        // if (!user.name) {
        //     window.location.reload();
        // }
    }, []);

    // const handleLogout = useCallback(() => {
    //     fetch(`${API_URL}/user/logout`, {
    //         method: 'GET',
    //         credentials: 'include',
    //     })
    //         .then(async (response) => {
    //             const data = await response.json();
    //             console.log(data);
    //             if (response.status === 200) {
    //                 console.log("Logged out");
    //             }
    //             else {
    //                 console.log("Logout failed");
    //             }
    //             logout();
    //             return navigate('/login');
    //         })
    //         .catch(
    //             // Navigate to login screen if not authenticated
    //             logout(),
    //             navigate('/login')
    //         );
    //     window.location.reload();
    // }, [API_URL, logout, navigate]);

    return (
        <div className='home-page'>
            {loggedIn ? (
                <>
                    <NavBar />
                    <div className='home-page-content'>
                        <div className='home-page-content-header'>
                            <h2 className="text-center">Hello, {user?.name}</h2>
                            <h1 className='home-title'>Home Page</h1>
                            {/* <div>
                                <button className='logout-button' onClick={handleLogout}>Logout</button>
                            </div> */}
                        </div>

                        <div className="new-quiz-section">
                            <h2 className="new-quiz-title">Pick up where you left Off</h2>
                            <h5 className="new-quiz-body">
                                Choose from a variety of quiz categories and start testing your knowledge. Earn points and climb the global rankings!
                            </h5>
                            <button onClick={() => {
                                navigate('/quiz');
                            }} className="new-quiz-button">Quiz Section</button>
                        </div>

                        {/* Global Rankings Page with context */}
                        <div className="global-ranking-section">
                            <h2 className="global-ranking-title">Global Rankings</h2>
                            <h4 className="global-ranking-body">
                                Check out the global rankings and see where you stand!
                            </h4>
                            <button onClick={() => {
                                navigate('/global');
                            }} className="global-ranking-button">View Global Rankings</button>
                        </div>

                        {/* About the Quiziity App */}
                        {/* <div className="about-section">
                            <h2 className="about-title">About</h2>
                            <h4 className="about-body">
                                Quiziity App is a web application that allows users to take quizzes on a variety of topics related to Latest Technologies, and compete with other users on the global leaderboard. Users can also create their own quizzes and share them with other users.
                            </h4>
                        </div> */}
                        <div id='about' className="about-section">
                            <h2 className="about-title">About</h2>
                            <h4 className="about-body">
                                Quiziity App is a web application that empowers users to explore and expand their knowledge across diverse subjects, ranging from the latest technologies
                                to a broad spectrum of topics. Our platform provides an engaging environment for users to take quizzes, challenge themselves, and compete with a global community.
                                Dive into the world of learning and fun as you earn points, climb the global leaderboard, and even create your own quizzes to share with others. Join Quiziity and embark on a journey of continuous learning and friendly competition!
                            </h4>
                        </div>


                        {/* Contact Us */}
                        <div id='contact' className="contact-section">
                            <h2 className="contact-title">Contact Us</h2>
                            <br />
                            <h4 className="contact-body">
                                Have any questions? Feel free to reach out to us at
                            </h4>
                            <h4 className="contact-body">
                                <a href="mailto:dsrajesh71@gmail.com" target="_blank" rel="noreferrer">
                                    dsrajesh71@gmail.com
                                </a>
                                <br />
                                <a href="https://github.com/rajeshds20" target="_blank" rel="noreferrer">
                                    Github
                                </a>
                                <br />
                                <a href="https://linkedin.com/in/devangamsajjarajesh" target="_blank" rel="noreferrer">
                                    LinkedIn
                                </a>
                            </h4>
                            {/* Star the Repo at github */}
                            <h4 className="contact-body">
                                <p>Support the Project by starring Repo at</p>
                                <a href="https://github.com/rajeshds20/quiziity" target="_blank" rel="noreferrer">GitHub</a>
                            </h4>
                        </div>

                        {/* Footer */}
                        <div className="footer">
                            <h4 className="footer-body">
                                Made with ❤️ by &nbsp;
                                <a href="https://linkedin.com/in/devangamsajjarajesh" target="_blank" rel="noreferrer">
                                    Rajesh
                                </a>
                            </h4>
                        </div>
                    </div>
                </>
            ) : (
                <div className='main-page' style={{ marginTop: '180px' }}>
                    <LogoutNav />
                    <div className='main-page-content'>
                        <h1 className='main-title'>Welcome to Quiz App</h1>
                        <p className='main-body'>
                            Quiziity App is a web application that allows users to take quizzes on a variety of topics related to Latest Technologies, and compete with other users on the global leaderboard. Users can also create their own quizzes and share them with other users.
                        </p>
                        <div className='main-buttons'>
                            <a href='/login' className='main-button'>Login</a>
                            <a href='/register' className='main-button'>Register</a>
                        </div>
                    </div>
                    <div id='contact' className="contact-section">
                        <h2 className="contact-title">Contact Us</h2>
                        <br />
                        <h4 className="contact-body">
                            Have any questions? Feel free to reach out to us at
                        </h4>
                        <h4 className="contact-body">
                            <a href="mailto:dsrajesh71@gmail.com" target="_blank" rel="noreferrer">
                                dsrajesh71@gmail.com
                            </a>
                            <br />
                            <a href="https://github.com/rajeshds20" target="_blank" rel="noreferrer">
                                Github
                            </a>
                            <br />
                            <a href="https://linkedin.com/in/devangamsajjarajesh" target="_blank" rel="noreferrer">
                                LinkedIn
                            </a>
                        </h4>
                        {/* Star the Repo at github */}
                        <h4 className="contact-body">
                            <p>Support the Project by starring Repo at</p>
                            <a href="https://github.com/rajeshds20/quiziity" target="_blank" rel="noreferrer">GitHub</a>
                        </h4>
                    </div>

                    {/* Footer */}
                    <div className="footer" style={{ width: '100vw' }}>
                        <h4 className="footer-body">
                            Made with ❤️ by &nbsp;
                            <a href="https://linkedin.com/in/devangamsajjarajesh" target="_blank" rel="noreferrer">
                                Rajesh
                            </a>
                        </h4>
                    </div>
                </div>
            )}
        </div>
    )
}
