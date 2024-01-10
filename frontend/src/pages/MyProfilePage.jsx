import { useState, useEffect } from 'react';
import { useUser } from '../config/UseUser';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

function MyProfilePage() {
    const [myData, setMyData] = useState(null);
    const { user } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        // Simulate fetching data from an API or a database
        console.log(user);
        fetch(`http://localhost:5000/user/myprofile`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.status === 200) {
                    console.log(data);
                    // setUsername(data.username);
                    // setEmail(data.email);
                    // setQuizzesTaken(data.quizzesTaken);
                    setMyData(data.profile);
                } else {
                    console.log(data);
                    alert(data.message);
                    navigate('/login');
                }
            })
            .catch((e) => {
                console.log(e.message);
                alert(e.message);
                navigate('/login');
            });
    }, [navigate, user]);

    return (
        //         <div>
        //             <h1>My Profile</h1>
        //             <p>Username: {myData?.name}</p>
        //             <p>Email: {myData?.email}</p>
        //             <p>Quizzes Taken: {myData?.quizzes.length}</p>
        //         </div>
        <div className="profile-container" style={{ margin: '10px', width: '100vw', textAlign: 'center' }}>
            <Navbar />
            <h1>My Profile</h1>
            {myData ? (
                <>
                    <div className="profile-info">
                        <p>
                            <strong>Username:</strong> {myData.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {myData.email}
                        </p>
                        <p>
                            <strong>Quizzes Taken:</strong> {myData.quizzes.length}
                        </p>
                    </div>

                    <div className="quiz-history">
                        {myData.quizzes.length > 0 &&
                            (<h2>Quiz History</h2>)
                        }
                        <ul>
                            {myData.quizzes.map((quiz) => (
                                <li key={quiz.id}>
                                    <p>
                                        <strong>Quiz:</strong> {quiz.title}
                                    </p>
                                    <p>
                                        <strong>Score:</strong> {quiz.score}
                                    </p>
                                    {/* Add more details about the quiz if needed */}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default MyProfilePage;