import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import AddArticle from './components/AddArticle';
import Contact from './components/Contact';
import About from './components/About';
import Login from './components/Login';



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/article/add" element={<AddArticle/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
