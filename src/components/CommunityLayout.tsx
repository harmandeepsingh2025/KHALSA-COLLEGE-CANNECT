import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  MessageSquare, 
  Home, 
  Search, 
  User, 
  MoreHorizontal, 
  Plus, 
  BookOpen, 
  Shield, 
  HelpCircle,
  FileText,
  ArrowLeft
} from 'lucide-react';

export default function CommunityLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { profile } = useAuth();
  
  const mainNav = [
    { name: 'Academic Feed', icon: <Home size={20} />, path: '/community/feed' },
    { name: 'Discussions', icon: <MessageSquare size={20} />, path: '/community/chat' },
    { name: 'Resources', icon: <BookOpen size={20} />, path: '/resources' },
    { name: 'FAQ Center', icon: <HelpCircle size={20} />, path: '/faq' },
    { name: 'Profile Dashboard', icon: <User size={20} />, path: '/profile' },
  ];

  const subNav = [
    { name: 'Feed', path: '/community/feed' },
    { name: 'Chat', path: '/community/chat' },
    { name: 'Library', path: '/resources' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="fixed w-full z-50 bg-white border-b border-gray-100 flex items-center justify-between px-8 h-16 shadow-sm">
        <div className="flex items-center gap-6 md:gap-12">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="p-2 mr-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-brand-navy transition-all group"
              title="Return to Main Website"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <Link to="/" className="text-xl font-bold text-brand-navy tracking-tight">
              KhalsaCollege Connect
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {subNav.map((item) => (
               <Link 
                key={item.name} 
                to={item.path}
                className={`text-sm font-medium transition-all py-5 relative ${
                  location.pathname === item.path 
                  ? 'text-brand-navy after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-[3px] after:bg-brand-navy' 
                  : 'text-gray-400 hover:text-brand-navy'
                }`}
               >
                 {item.name}
               </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-gray-500 hover:text-brand-navy relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="text-gray-500 hover:text-brand-navy">
            <Search size={20} />
          </button>
          <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            <img 
              src={profile?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </Link>
        </div>
      </header>

      <div className="flex grow pt-16">
        {/* Sidebar */}
        <aside className="w-72 fixed left-0 top-16 bottom-0 bg-white border-r border-gray-100 hidden lg:flex flex-col p-6 overflow-y-auto">
          <div className="mb-10 px-2 flex items-center gap-4">
             <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center text-white font-bold text-xl">
               KC
             </div>
             <div>
                <h3 className="font-bold text-brand-navy uppercase tracking-wider text-xs">Khalsa Connect</h3>
                <p className="text-[10px] text-gray-400 font-medium">For the student, by the student</p>
             </div>
          </div>
          
          <button className="btn-secondary w-full py-4 mb-10 flex items-center justify-center gap-2 font-bold shadow-lg shadow-brand-gold/10">
            <Plus size={18} />
            New Post
          </button>
          
          <nav className="space-y-2 mb-auto">
            {mainNav.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all ${
                  location.pathname === item.path 
                  ? 'bg-brand-navy text-white shadow-lg shadow-brand-navy/10' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-brand-navy'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-10 pt-10 border-t border-gray-50 space-y-4">
             <Link to="#" className="flex items-center gap-4 px-4 py-2 text-gray-400 hover:text-brand-navy font-semibold text-sm transition-colors">
                <FileText size={18} />
                Terms
             </Link>
             <Link to="#" className="flex items-center gap-4 px-4 py-2 text-gray-400 hover:text-brand-navy font-semibold text-sm transition-colors">
                <HelpCircle size={18} />
                Help
             </Link>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:ml-72 flex-grow p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
