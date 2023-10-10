import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function HomePage() {

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/user/hi`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                if (response.status === 200) {
                    console.log("Authentication verified");
                }
                else {
                    console.log("Authentication failed");
                    navigate('/login');
                }
            })
            .catch(
                // Navigate to login screen if not authenticated
                navigate('/login')
            );
    }, [navigate]);

    return (
        <div>
            <h1>Home Page</h1>

            <button onClick={() => {
                fetch(`http://localhost:5000/user/logout`, {
                    method: 'GET',
                    credentials: 'include',
                })
                    .then(async (response) => {
                        if (response.status === 200) {
                            console.log("Logged out");
                            navigate('/login');
                        }
                        else {
                            console.log("Logout failed");
                        }
                    })
                    .catch(
                        console.log("Logout failed")
                    );
            }}>Logout</button>

        </div>
    )
}
