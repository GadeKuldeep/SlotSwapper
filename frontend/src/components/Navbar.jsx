import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white font-bold text-xl">
            SlotSwapper
          </Link>

          <div className="flex space-x-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  to="/marketplace"
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md"
                >
                  Marketplace
                </Link>
                <Link
                  to="/requests"
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md"
                >
                  Requests
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white hover:text-indigo-200 px-3 py-2 rounded-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;