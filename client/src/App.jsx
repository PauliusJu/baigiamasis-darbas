import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/header/Header';
import DeductFunds from './pages/DeductFunds';
import AddFunds from './pages/AddFunds';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import axios from 'axios';

const WelcomeMessage = ({ message }) => (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <h1 style={{ fontSize: '3rem', color: 'black' }}>{message}</h1>
    </div>
);

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('/api/user/check-auth')
            .then(resp => {
                if (resp.data) {
                    setUser(resp.data);
                }
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    const handleLogout = () => {
        axios.get('/api/user/logout')
            .then(() => {
                setUser(null);
            });
    };

    return ( 
        <BrowserRouter>
            <Header user={user} setUser={setUser} handleLogout={handleLogout} />
            <div className="container">
                <Routes>
                    {user ? (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/add-funds/:id" element={<AddFunds />} />
                            <Route path="/deduct-funds/:id" element={<DeductFunds />} />
                            <Route path="/create-account" element={<CreateAccount />} />
                            <Route path="*" element={<WelcomeMessage message="Sveiki atvykę!" />} />
                        </>
                    ) : (
                        <>
                            <Route path="/login" element={<Login setUser={setUser} />} />
                            <Route path="*" element={<WelcomeMessage message="Sveiki atvykę!" />} />
                        </>
                    )}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
