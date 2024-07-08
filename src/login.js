import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import authService from './authService';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #044f48, #2a7561);
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: none;
  border-radius: 5px;
`;

const Button = styled.button`
  margin: 10px 0;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #248a52;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #1d7745;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  margin-top: 10px;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await authService.login(email, password);
      console.log('Login response:', userData);
      if (userData.username && userData.token) {
        localStorage.setItem('user', JSON.stringify({ username: userData.username }));
        localStorage.setItem('token', userData.token);
        navigate('/chatbot'); // Redirect to chatbot page after successful login
      } else {
        setError('Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit">Login</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;