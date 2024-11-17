// src/components/auth/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { toast } from 'react-toastify';
import './signUp.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            sessionStorage.setItem('userID', user.uid);
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
            toast.error('Error logging in');
        }
    };

    return (
        <div className='flex justify-center items-center w-100 h-[100vh]'>
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login">Login Form</div>
                    <div className="title signup" onClick={() => navigate('/signup')}>Signup Form</div>
                </div>
                <div className="form-container">
                    <div className="slide-controls">
                        <input type="radio" name="slide" id="login" checked />
                        <input type="radio" name="slide" id="signup" />
                        <label className="slide login">Login</label>
                        <label className="slide signup" onClick={() => navigate('/signup')}>Signup</label>
                        <div className="slider-tab"></div>
                    </div>
                    <div className="form-inner">
                        <form onSubmit={handleLogin} className="login">
                            <div className="field">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                />
                            </div>
                            <div className="field">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="pass-link"><span>Forgot password?</span></div>
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" value="Login" />
                            </div>
                            <div className="signup-link">
                                Create an account{' '}
                                <span className='cursor-pointer' onClick={() => navigate('/signup')}>Signup now</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
