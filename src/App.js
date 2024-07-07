import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Chatbot from './chatbot';
import Login from './login';
import Register from './register';
import './App.css';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login">
            {isAuthenticated ? <Redirect to="/" /> : <Login setAuth={setIsAuthenticated} />}
          </Route>
          <Route path="/register">
            {isAuthenticated ? <Redirect to="/" /> : <Register setAuth={setIsAuthenticated} />}
          </Route>
          <Route path="/">
            {isAuthenticated ? <Chatbot /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
