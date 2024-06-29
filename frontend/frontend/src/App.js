// src/App.js
import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AddArticle from './components/AddArticle';
import EditArticle from './components/EditArticle'; // Import EditArticle
import Contact from './components/Contact';
import About from './components/About';
import Login from './components/Login';
import ArticleDetail from './components/ArticleDetail';
import { AuthContext, AuthProvider } from './context/AuthContext';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/article/add" element={<PrivateRoute><AddArticle /></PrivateRoute>} />
                <Route path="/article/edit/:id" element={<PrivateRoute><EditArticle /></PrivateRoute>} /> {/* Add the route */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
            </Routes>
        </Router>
    );
};

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    console.log("PrivateRoute: isAuthenticated", isAuthenticated); // Debug log

    if (loading) {
        return <div>Loading...</div>; // Render a loading state while verifying auth
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppWrapper = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

export default AppWrapper;
