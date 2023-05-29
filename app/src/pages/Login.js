import React,{useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect,setRedirect]=useState(false);
    const {setUserInfo} = useContext(UserContext);
    const login=async(e)=>{
        e.preventDefault();
        const response=await fetch('http://localhost:3001/login',{
            method: 'POST',
            body: JSON.stringify({username,password}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        });
        if(response.ok){
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);})
        }else{
            alert('Login failed');
        }
        // fetch('http://localhost:3001/login',{
        //     method: 'POST',
        //     body: JSON.stringify({username,password}),
        //     headers: {'Content-Type': 'application/json'},
        //     credentials: 'include'
        // }).then((res)=>{
        //     if(res.ok){
        //         navigate('/')
        //     }
        //     else{
        //         alert('Login failed');
        //     }
        // })
    }
    if(redirect){
        navigate('/');
    }

    return (
        <form action="" className='login' onSubmit={login} >
            <h1>Login</h1>
            <input type="text" placeholder='username' value={username}
            onChange={e=>{setUsername(e.target.value)}} />
            <input type="password" placeholder='password' value={password} 
            onChange={e=>{setPassword(e.target.value)}} />
            <button type='submit'>Login</button>
        </form>
    )
}
