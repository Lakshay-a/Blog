import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './UserContext'

export default function Header() {
    const { userInfo, setUserInfo } = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:3001/profile', {
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 401) {
                setUserInfo(null);
                throw new Error('Unauthorized');
            } else {
                throw new Error('Error occurred');
            }
        })
        .then(userInfo => {
            if (userInfo !== null){
                setUserInfo(userInfo);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    function logout() {
        fetch('http://localhost:3001/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;
    return (
        <header>
            <Link to="/" className='logo' >My Blog</Link>
            <nav>
                {username && (
                    <>
                        <span>Welcome, {username}!</span>
                        <Link to="/create">New Post</Link>
                        <a href="" onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    )
}
