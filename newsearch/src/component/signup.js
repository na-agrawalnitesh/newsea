import React, { useState } from 'react';
import "../style/style.css";
import { useNavigate } from 'react-router-dom';
import { SignupUser } from './Api';

const Signup = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [signupMsg, setSignupMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();


        const response = await SignupUser(formData, navigate);


        if (response?.success) {
            navigate('/');
        } else {
            setSignupMsg("Signup failed. Please try again.");
        }
    }

    const handleClick = () => {
        navigate('/');
    }

    return (
        <div>
            <div className="login-wrap">
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-heading">Signup</div>
                        <p className="login-paragraph">Sign up for an account</p>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="email" className="input-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="input-field"
                                    placeholder="Enter your email"
                                    name="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="password" className="input-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="input-field"
                                    placeholder="Enter your password"
                                    name="password"
                                    onChange={handleChange}
                                    value={formData.password}
                                />
                            </div>

                            <button type="submit" className="login-button">Signup</button>
                        </form>

                        <button className="login-button" onClick={handleClick}>Back to Login</button>

                        {signupMsg && <div className="login-message">{signupMsg}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
