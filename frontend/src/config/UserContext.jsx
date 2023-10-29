/* eslint-disable react/prop-types */
// UserContext.js
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [darkTheme, setDarkTheme] = useState(true)

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/user/hi`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.status === 200) {
                    // console.log("Authenticated");
                    setUser(data.user);
                    // setLoggedIn(true);
                    setLoggedIn(data.user !== null);
                }
            })
            .catch(
            // console.log("Not authenticated")
        );
    }, [API_URL]);

    const login = (userData) => {
        setUser(userData);
        setLoggedIn(userData !== null);
    };

    const logout = async () => {
        await fetch(`${API_URL}/user/logout`, {
            method: 'GET',
            credentials: 'include',
        }).then(async (response) => {
            const data = await response.json();
            if (response.status === 200) {
                console.log("Logged out");
                setUser(null);
                setLoggedIn(false);
            }
            else {
                console.log(data);
                alert(data.message);
            }
        }).catch((e) => {
            console.log(e.message),
                alert(e.message)
        }
        );
    };

    const changeTheme = () => {
        setDarkTheme(prev => !prev);
    }

    return (
        <UserContext.Provider value={{ user, loggedIn, login, logout, darkTheme, changeTheme }}>
            {children}
        </UserContext.Provider>
    );
};
