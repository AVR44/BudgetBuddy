import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'demo@example.com',  // Pre-filled with demo credentials
    password: 'password123',    // Pre-filled with demo credentials
  });
  const { login, isAuthenticated, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email });
      const success = await login(formData);
      console.log('Login result:', success);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      
      <div className="demo-creds">
        <h4>Demo Credentials (Pre-filled)</h4>
        <p>Email: demo@example.com</p>
        <p>Password: password123</p>
      </div>
    </div>
  );
};

export default Login; 