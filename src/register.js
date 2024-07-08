import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import authService from './authService';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #044f48, #2a7561);
`;

const RegisterForm = styled.form`
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

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await authService.register(username, email, password);
      localStorage.setItem('user', JSON.stringify({ username: userData.username }));
      onRegister();
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        />
        <Button type="submit">Register</Button>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;
