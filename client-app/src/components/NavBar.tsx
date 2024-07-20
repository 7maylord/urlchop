import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/analytics">Analytics</Link></li>
                <li><Link to="/linkhistory">Link History</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;
