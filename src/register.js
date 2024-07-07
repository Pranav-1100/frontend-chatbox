import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', { username, email, password });
      localStorage.setItem('token', response.data.token);
      setAuth(true);
    } catch (error) {
      setError('User already exists or invalid details');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {
              {error && <p>{error}</p>}
              <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Register</button>
              </form>
            </div>
          );
        };
        
        export default Register;
        
