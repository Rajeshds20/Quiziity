/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../config/UseUser';
import '../assets/css/LoginPage.css'

export default function LoginPage() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [Invalid, setInvalid] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    const { loggedIn, login, darkTheme } = useUser();

    useEffect(() => {
        if (loggedIn) {
            navigate('/');
        }
    }, [loggedIn, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        if (!email || !password) {
            alert("Please enter all fields");
            setLoading(false);
            return;
        }
        setLoading(true);
        fetch(`${API_URL}/user/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(async (response) => {
                const data = await response.json();
                console.log(data);
                if (response.status === 200) {
                    console.log("Logged in");
                    setInvalid(false);
                    alert("Login Successful");
                    login(data.userId);
                    navigate('/');
                }
                else {
                    console.log("Login failed");
                    setInvalid(true);
                }
                setLoading(false);
            })
            .catch(
                console.log("Login failed")
            );
    }

    return (
        <div className={`login-component ${darkTheme ? 'dark' : 'light'}-theme`} >
            <div className='login-container'>
                <h1 style={{ fontSize: '34px' }} className='heading'>Login Page</h1>
                <form
                    id='login-form'
                    className='login-form'
                    onSubmit={handleLogin}
                >
                    <input className={`${darkTheme ? 'dark' : 'light'}-theme`} id='login-email' type="email" name="email" placeholder="Email" />
                    <input className={`${darkTheme ? 'dark' : 'light'}-theme`} id='login-password' type="password" name="password" placeholder="Password" />
                    {
                        Invalid ? <p style={{ color: 'red', margin: '-10px' }}>Invalid Credentials</p> : null
                    }
                    {
                        loading ? <button disabled type='submit'>Loading...</button> : <button type="submit">Login</button>
                    }
                    <div>
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}
