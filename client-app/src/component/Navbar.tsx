import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          UrlChop
        </div>
        <div>
        {auth?.user ? (
            <>
              <Link to="/shorten" className="text-white mr-4 hover:text-gray-300">Shorten URL</Link>
              <Link to="/link-history" className="text-white mr-4 hover:text-gray-300">Link History</Link>
              <Link to="/analytics/:urlId" className="text-white mr-4 hover:text-gray-300">Analytics</Link>
              <button onClick={handleLogout} className="text-white hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/" className="text-white mr-4 hover:text-gray-300">Home</Link>
              <Link to="/login" className="text-white mr-4 hover:text-gray-300">Login</Link>
              <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
