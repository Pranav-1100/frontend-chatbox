import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('Retrieved token:', token);
  return token;
};

const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({ username: response.data.username }));
    console.log('User registered:', response.data.username);
  }
  return response.data;
};

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token && response.data.username) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ username: response.data.username }));
      console.log('Stored user data:', localStorage.getItem('user'));
    } else {
      console.error('Login response missing token or username');
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('User logged out. LocalStorage cleared.');
};
const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Current user:', user);
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

const getUsername = () => {
  const userString = localStorage.getItem('user');
  console.log('User string from localStorage:', userString);
  if (!userString) {
    console.log('No user data found in localStorage');
    return null;
  }
  try {
    const user = JSON.parse(userString);
    console.log('Parsed user data:', user);
    return user.username || null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  getUsername,
};

export default authService;