import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Youtube as YouTubeIcon, UserRound, UserCircle, LogIn, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleMenu}
        className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile menu sidebar */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-64 bg-gray-900 border-l border-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <div className="flex items-center">
              <YouTubeIcon className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                YouTube Summarizer
              </span>
            </div>
            <button 
              onClick={closeMenu} 
              className="p-2 text-gray-300 hover:text-white rounded-lg"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-gradient-to-r from-red-600/30 to-pink-600/30 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={closeMenu}
                >
                  <Home className="h-5 w-5 mr-3" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/creator-tracker" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/creator-tracker' 
                      ? 'bg-gradient-to-r from-red-600/30 to-pink-600/30 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={closeMenu}
                >
                  <UserRound className="h-5 w-5 mr-3" />
                  Creator Tracker
                </Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      to="/profile" 
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === '/profile' 
                          ? 'bg-gradient-to-r from-red-600/30 to-pink-600/30 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                      onClick={closeMenu}
                    >
                      <UserCircle className="h-5 w-5 mr-3" />
                      Profile
                    </Link>
                  </li>
                  <li className="pt-4 mt-6 border-t border-gray-800">
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      <LogIn className="h-5 w-5 mr-3 transform rotate-180" />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="pt-4 mt-6 border-t border-gray-800">
                  <Link 
                    to="/auth" 
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === '/auth' 
                        ? 'bg-gradient-to-r from-red-600/30 to-pink-600/30 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={closeMenu}
                  >
                    <LogIn className="h-5 w-5 mr-3" />
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          
          <div className="p-4 text-xs text-gray-500 border-t border-gray-800">
            <p>&copy; {new Date().getFullYear()} YouTube Summarizer</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav; 