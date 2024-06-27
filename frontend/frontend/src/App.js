// src/App.js
import React, { useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AddArticle from './components/AddArticle';
import Contact from './components/Contact';
import About from './components/About';
import Login from './components/Login';
import ArticleDetail from './components/ArticleDetail';  // Import ArticleDetail
import { AuthContext, AuthProvider } from './context/AuthContext';

const App = () => {
    const { verifyAuth } = useContext(AuthContext);

    useEffect(() => {
        verifyAuth();
    }, [verifyAuth]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/article/add" element={<PrivateRoute><AddArticle /></PrivateRoute>} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />  {/* Add the route */}
            </Routes>
        </Router>
    );
};

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppWrapper = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

export default AppWrapper;
