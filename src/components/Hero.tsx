import { ArrowRight, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const handleAction = async () => {
    if (isLoggedIn) {
      navigate('/community/feed');
    } else {
      try {
        await login();
        navigate('/community/feed');
      } catch (error) {
        console.error("Login failed", error);
      }
    }
  };

  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-brand-navy text-xs font-semibold uppercase tracking-widest mb-8"
            >
              <div className="p-1 bg-white rounded-full">
                <GraduationCap size={14} />
              </div>
              FOR THE STUDENT, BY THE STUDENT
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-6xl lg:text-7xl font-bold text-brand-navy leading-[1.1] mb-8"
            >
              Bridging the Gap <br />
              Between Semesters
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-600 leading-relaxed max-w-lg mb-10"
            >
              Join a collaborative academic community where seniors and juniors unite. 
              Access curated notes, previous year questions (PYQs), and expert 
              guidance to foster a healthier, more connected college environment.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={handleAction}
                className="btn-primary group"
              >
                {isLoggedIn ? 'Jump to Community' : 'Join Academic Community'}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link to="/resources" className="btn-secondary">
                Explore Resources
              </Link>
            </motion.div>
          </div>

          {/* Right Images (Staggered Grid) */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="row-span-2"
              >
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                  alt="Students studying" 
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col gap-4"
              >
                <img 
                  src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=2068&auto=format&fit=crop" 
                  alt="Notes and workspace" 
                  className="w-full aspect-[4/3] object-cover rounded-2xl shadow-xl"
                  referrerPolicy="no-referrer"
                />
                
                <div className="bg-brand-navy h-full w-full rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-xl">
                    <div className="p-4 bg-brand-gold/20 rounded-full mb-4">
                        <svg className="w-10 h-10 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </div>
                    <span className="text-white text-3xl font-serif font-bold mb-1">Add Knowledge</span>
                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider italic">Help People Grow</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
