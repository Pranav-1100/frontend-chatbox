import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Chatbot from './chatbot';
import Login from './login';
import Register from './register';
import './App.css';
import authService from './authService';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.getUsername() !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getToken();
      const username = authService.getUsername();
      if (token && username) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/chatbot" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/chatbot" /> : <Register />} 
          />
          <Route 
            path="/chatbot" 
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to="/chatbot" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;