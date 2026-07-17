import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth-context';

const Navbar = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          Url<span className="text-accent">Chop</span>
        </Link>
        <div className="flex items-center gap-1 text-sm sm:gap-2">
          {auth?.user ? (
            <>
              <Link to="/link-history" className="rounded-md px-3 py-2 text-muted transition hover:text-ink">
                Links
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-muted transition hover:text-ink active:scale-95"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-2 text-muted transition hover:text-ink">
                Log in
              </Link>
              <Link to="/register" className="uc-btn-accent px-3 py-2 transition hover:-translate-y-0.5 active:scale-95">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
