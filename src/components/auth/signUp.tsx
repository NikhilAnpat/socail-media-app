// src/components/auth/SignUp.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import './signUp.css';

const SignUp: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: name,
                email: user.email,
                following: [],
                posts: [],
                createdAt: new Date(),
            });

            toast.success('Registration Successful');
            navigate('/login');
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        }
    };
    return (
        <div className='flex justify-center items-center w-100 h-[100vh]'>
            <div className="wrapper">
                <div className="title-text">
                    <div className="title login" onClick={() => navigate('/login')}>Login Form</div>
                    <div className="title signup">Signup Form</div>
                </div>
                <div className="form-container">
                    <div className="slide-controls">
                        <input type="radio" name="slide" id="login" />
                        <input type="radio" name="slide" id="signup" checked />
                        <label className="slide login" onClick={() => navigate('/login')}>Login</label>
                        <label className="slide signup">Signup</label>
                        <div className="slider-tab"></div>
                    </div>
                    <div className="form-inner">
                        <form onSubmit={handleSignUp} className="signup">
                            <div className="field">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    required
                                />
                            </div>
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
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />

                            </div>
                            <div className="field">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    required
                                />

                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="field btn">
                                <div className="btn-layer"></div>
                                <input type="submit" value="Signup" />
                            </div>
                            <div className="signup-link">
                                Already have an account?{' '}
                                <span className='cursor-pointer' onClick={() => navigate('/login')}>Login</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SignUp;
