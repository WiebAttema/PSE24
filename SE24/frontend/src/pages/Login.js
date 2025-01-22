import React, { useEffect, useState } from 'react'
import { initializeFormMovement } from '../components/login/moveform.js' // Zorg ervoor dat je de juiste import gebruikt voor de moveform.js file
import '../components/login/Login.css';

import { useNavigate } from 'react-router-dom'

const MyFormComponent = () => {
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignIn = async (e) => {
        e.preventDefault()

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        const data = await response.json()
        if (response.ok) {
            // Use react router to navigate to dashboard.
            navigate('/')
        } else {
            setMessage(data.message)
        }
    }
    const handleRegistration = async (e) => {
        e.preventDefault() // Prevent default form submission

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        })

        const data = await response.json()
        if (response.ok) {
            // A succesful registration functions as a login.
            navigate('/')
        } else {
            console.error(data.message)
        }
    }
    return (

        <div class='container' id='container'>
            <div class='form-container sign-up-container'>
                <form className='login_form' onSubmit={handleRegistration}>
                    <h1 className='login_h1'>Create Account</h1>

                    <input className='login_input'
                        type='text'
                        placeholder='Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input className='login_input'
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input className='login_input'
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className='login_button' >Sign Up</button>
                </form>
            </div>
            <div class='form-container sign-in-container'>
                <form className='login_form' onSubmit={handleSignIn}>
                    <h1 className='login_h1'>Sign in</h1>
                    <p className='login_subtext'>Use email for registration</p>
                    <input className='login_input'
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input className='login_input'
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <a className='login_a' href='#'>Forgot your password?</a>
                    <button className='login_button' >Sign In</button>
                </form>
            </div>
            <div class='overlay-container'>
                <div class='overlay'>
                    <div class='overlay-panel overlay-left'>
                        <h1 className='login_h1-white'>Welcome Back!</h1>
                        <p className='login_p'>Transform your coding experience! Login and discover more.</p>
                        <button className='login_button' class='login_secondary-button' id='signIn'>
                            Sign In
                        </button>
                    </div>
                    <div class='overlay-panel overlay-right'>
                        <h1 className='login_h1-white'>CodeInsight</h1>
                        <p className='login_p'>Your coding journey starts with us!</p>
                        <button className='login_button' class='login_secondary-button' id='signUp'>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

const Login = () => {
    useEffect(() => {
        const cleanup = initializeFormMovement()
        return cleanup
    }, [])

    return (

        <MyFormComponent />

    )
}

export default Login
