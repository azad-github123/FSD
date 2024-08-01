import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      const passwordErrors = validatePassword(value);
      setErrors({
        ...errors,
        password: passwordErrors,
      });
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let formErrors = {};
    if (!formData.username) {
      formErrors.username = 'Username is required.';
    }
    const passwordValidationMessage = validatePassword(formData.password);
    if (passwordValidationMessage) {
      formErrors.password = passwordValidationMessage;
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:9900/login', formData);
      const { token } = response.data;

      localStorage.setItem('jwtToken', token);
      console.log('Login successful');
      window.location.href = '/home'; // Redirect to home or another page
    } catch (error) {
      setLoginError('Invalid username or password. Please try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          {loginError && <p className="error">{loginError}</p>}
          <button type="submit">Sign In</button>
        </form>
        <p>
          Forgot password? <a href="http://localhost:3000/forgotPassword" className="forgot-link">Click here.</a>
        </p>
        <p>
          New user? <a href="http://localhost:3000/signup" className="signup">Click here.</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
