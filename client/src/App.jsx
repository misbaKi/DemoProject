import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Trials from './pages/Trials';
import Participants from './pages/Participants';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import { useState, useEffect } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const handleLogin = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer position="top-right" autoClose={3000} />
            <Router>
                <Routes>
                    <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
                    <Route element={user ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/trials" element={<Trials />} />
                        <Route path="/participants" element={<Participants />} />
                        <Route path="/reports" element={<Reports />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
