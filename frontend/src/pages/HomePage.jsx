/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../config/UseUser';
import NavBar from '../components/NavBar';
import '../assets/css/HomePage.css'

export default function HomePage() {

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const { user, loggedIn, logout } = useUser();

    useEffect(() => {
        if (!loggedIn) {
            navigate('/login');
        }
    }, []);

    const handleLogout = useCallback(() => {
        fetch(`${API_URL}/user/logout`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                const data = await response.json();
                console.log(data);
                if (response.status === 200) {
                    console.log("Logged out");
                }
                else {
                    console.log("Logout failed");
                }
                logout();
                return navigate('/login');
            })
            .catch(
                // Navigate to login screen if not authenticated
                logout(),
                navigate('/login')
            );
        window.location.reload();
    }, [API_URL, logout, navigate]);

    return (
        <div className='home-page'>
            {loggedIn && (
                <>
                    <NavBar />
                    <div className='home-page-content'>
                        <div className='home-page-content-header'>
                            <h1 className='home-title'>Home Page</h1>
                            <h2 className="text-center">Hello, {user?.name}</h2>
                            <div>
                                <button className='logout-button' onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
