import { Bell, User, Search, LogOut, MessageSquare, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, profile } = useAuth();
  const isSpecialPage = location.pathname === '/resources' || location.pathname === '/upload';
  
  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Resources', path: '/resources' },
    { name: 'Upload', path: '/upload' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-brand-navy md:bg-white border-b border-gray-100 md:h-20 h-16 flex items-center shadow-sm">
      <div className="container-custom flex items-center gap-4">
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Browser-like Navigation Controls */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            <button 
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              title="Go Back"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => navigate(1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              title="Go Forward"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <Link to="/" className="text-xl md:text-2xl font-bold text-white md:text-brand-navy tracking-tight whitespace-nowrap">
            KhalsaCollege Connect
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`font-medium transition-all relative ${
                    isActive 
                      ? 'text-brand-navy after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-brand-gold' 
                      : 'text-gray-500 hover:text-brand-navy'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {isSpecialPage && (
            <div className="hidden md:flex flex-grow max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search archive..." 
                        className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold transition-all"
                    />
                </div>
            </div>
        )}
        
        <div className="flex items-center gap-4 md:gap-6 ml-auto">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/community/feed" 
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-brand-gold/10 text-brand-navy flex items-center justify-center hover:bg-brand-gold transition-all group"
                title="Community"
              >
                <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center gap-3 pl-4 md:border-l border-gray-200 group"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-brand-navy leading-none mb-1">{profile?.displayName}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{profile?.role}</p>
                </div>
                <img 
                  src={profile?.photoURL || ''} 
                  alt="" 
                  className="w-10 h-10 rounded-xl object-cover border-2 border-transparent group-hover:border-brand-gold transition-all"
                />
              </Link>
              <button 
                onClick={logout}
                className="text-white md:text-gray-400 hover:text-red-500 transition-colors ml-2"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <button className="text-white md:text-gray-500 hover:text-brand-navy transition-colors">
                <Bell size={24} className="w-5 md:w-6" />
              </button>
              <Link to="/register" className="text-white md:text-gray-500 hover:text-brand-navy transition-colors">
                <User size={24} className="w-5 md:w-6" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
