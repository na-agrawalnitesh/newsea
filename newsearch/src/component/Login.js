import React, { useState } from 'react';
import "../style/style.css";
import { useNavigate } from 'react-router-dom';
import { loginUser } from './Api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loginMsg, setLoginMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();


        const response = await loginUser(formData, navigate);



        if (response?.status === "success") {

            localStorage.setItem("token", response?.data);
            localStorage.setItem("username", formData.email);


            navigate('/dashboard');
        } else {
            console.log("error")
            setLoginMsg("Invalid username or password.");
        }
    }

    const handleClick = () => {
        navigate('/nits');
    }

    return (
        <div>
            <div className="login-wrap">
                <div className="login-container">
                    <div className="login-card">
                        <div className="login-heading">Login</div>
                        <p className="login-paragraph">Sign in to your account</p>
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

                            <button type="submit" className="login-button">Login</button>
                        </form>

                        {/* <button className="login-button" onClick={handleClick}>Signup</button> */}

                        {loginMsg && <div className="login-message">{loginMsg}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
