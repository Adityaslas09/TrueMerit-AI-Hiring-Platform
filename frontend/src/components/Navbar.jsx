import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="TrueMerit Logo" className="h-10 w-10 object-contain rounded-xl" />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">TrueMerit</span>
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-textMuted text-sm">Hello, {user.name} ({user.role})</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-textLight bg-red-600/80 hover:bg-red-500 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-sm text-textLight hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="px-4 py-2 text-sm bg-primary hover:bg-blue-600 text-white rounded-md transition-colors">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
