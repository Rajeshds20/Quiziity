import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function HomePage() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [Invalid, setInvalid] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/user/hi`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                if (response.status === 200) {
                    console.log("Authenticated");
                    navigate('/');
                }
                else {
                    console.log("Not authenticated");
                }
            })
            .catch(
                console.log("Not authenticated")
            );
    }, [navigate]);

    return (
        <div>
            <h1>Login Page</h1>

            <form
                id='login-form'
                onSubmit={(e) => {
                    e.preventDefault();
                    const email = e.target.email.value;
                    const password = e.target.password.value;
                    if (!email || !password) {
                        alert("Please enter all fields");
                        setLoading(false);
                        return;
                    }
                    setLoading(true);
                    fetch(`http://localhost:5000/user/login`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    })
                        .then(async (response) => {
                            if (response.status === 200) {
                                console.log("Logged in");
                                setInvalid(false);
                                alert("Login Successful");
                                navigate('/');
                            }
                            else {
                                console.log("Login failed");
                                setInvalid(true);
                            }
                        })
                        .catch(
                            console.log("Login failed")
                        );
                }}
            >
                <input id='login-email' type="email" name="email" placeholder="Email" />
                <input id='login-password' type="password" name="password" placeholder="Password" />
                {
                    Invalid ? <p style={{ color: 'red', margin: '-10px' }}>Invalid Credentials</p> : null
                }
                {
                    loading ? <button disabled type='submit'>Loading...</button> : <button type="submit">Login</button>
                }
            </form>
        </div>
    )
}
