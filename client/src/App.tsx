import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Home from './components/Home';
import React, { useEffect } from 'react';
import { useAuthContext } from './context/AuthContext';

function App() {
  const [loading, setLoading] = React.useState(true);
  const { checkAuth } = useAuthContext();

  useEffect(() => {
    const authenticate = async () => {
      await checkAuth();
      setLoading(false);
    }

    authenticate();
  }, []);

  if (loading) {
    return <h1 className="App">Loading ... </h1>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
