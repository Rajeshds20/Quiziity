import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '../config/UseUser';
import '../assets/css/RegisterPage.css'

export default function RegisterPage() {

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

    const handleRegister = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        if (!name || !email || !password) {
            alert("Please enter all fields");
            setLoading(false);
            return;
        }
        setLoading(true);
        fetch(`${API_URL}/user/new`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
            .then(async (response) => {
                if (response.status === 200) {
                    const json = await response.json();
                    console.log("Registered");
                    setInvalid(false);
                    alert("Registration Successful");
                    login(json.userId);
                    navigate('/login');
                }
                else {
                    console.log("Registration failed");
                    setInvalid(true);
                }
            })
            .catch(
                console.log("Registration failed")
            );
    }

    return (
        <div className={`register-component ${darkTheme ? 'dark' : 'light'}`}>
            <div className='register-container'>
                <h1 className='heading'>Register Page</h1>

                <form
                    id='register-form'
                    onSubmit={handleRegister}
                >
                    <input id='register-name' type="text" name="name" placeholder="Name" />
                    <input id='register-email' type="email" name="email" placeholder="Email" />
                    <input id='register-password' type="password" name="password" placeholder="Password" />
                    {
                        Invalid ? <p style={{ color: 'red', margin: '-10px' }}>Registration Failed</p> : null
                    }
                    {
                        loading ? <button disabled type='submit'>Loading...</button> : <button type="submit">Register</button>
                    }
                    <div>
                        <p>Already have an account? <a href="/login">Login</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}
