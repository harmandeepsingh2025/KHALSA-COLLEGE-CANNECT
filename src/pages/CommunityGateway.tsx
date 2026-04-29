import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function CommunityGateway() {
  const [agreed, setAgreed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (agreed) {
      localStorage.setItem('community_joined', 'true');
      navigate('/community/feed');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side Backdrop */}
      <div className="lg:w-[45%] relative bg-brand-navy flex flex-col justify-end p-12 lg:p-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08759df9a73?q=80&w=2070&auto=format&fit=crop" 
            alt="Library" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
        </div>
        
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">KhalsaCollege Connect</h1>
            <p className="text-brand-gold font-medium uppercase tracking-[0.2em] text-xs">For the student, by the student</p>
          </div>
          
          <div className="mt-auto">
             <div className="p-3 bg-brand-gold/20 rounded-xl inline-block mb-10">
                <BookOpen className="text-brand-gold" size={32} />
             </div>
             <p className="text-3xl lg:text-4xl font-serif text-white leading-tight max-w-sm">
                Enter a space where traditional academic prestige meets the collaborative nature of a digital community.
             </p>
          </div>
        </div>
      </div>

      {/* Right Side Content */}
      <div className="flex-grow flex items-center justify-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-xl text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-5xl lg:text-6xl font-serif font-bold text-brand-navy mb-6">Gateway to Connect</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Review and accept the community guidelines to proceed into the academic forum.
            </p>
          </motion.div>
          
          <div className="bg-white border-2 border-brand-gold/20 rounded-3xl p-10 shadow-xl shadow-gray-100 relative mb-12">
            <div className="absolute -top-1 left-0 right-0 h-1 bg-brand-gold rounded-t-3xl" />
            
            <label className="flex items-start gap-6 cursor-pointer group text-left">
              <div className="relative mt-1">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-6 h-6 border-2 border-gray-200 rounded-md peer-checked:bg-brand-navy peer-checked:border-brand-navy transition-all" />
                <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="text-lg font-medium text-gray-700 leading-snug group-hover:text-brand-navy transition-colors">
                I agree to the professional conduct terms and acknowledge this is a monitored academic space.
              </span>
            </label>
            
            <div className="mt-8">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-gray-200 rounded-full text-gray-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Show Details
                </div>
                <ChevronDown className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} size={18} />
              </button>
              
              {showDetails && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 p-4 text-xs text-gray-500 text-left bg-gray-50 rounded-xl border border-gray-100 overflow-hidden leading-relaxed"
                >
                  By joining, you commit to maintaining academic integrity. Zero tolerance for harassment, 
                  plagiarism facilitation, or non-scholarly content. Conversations are archived for educational auditing.
                </motion.div>
              )}
            </div>
            
            <button 
              onClick={handleProceed}
              disabled={!agreed}
              className={`w-full mt-10 py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                agreed 
                ? 'bg-brand-navy text-white shadow-xl shadow-brand-navy/20 hover:scale-[1.02]' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              PROCEED TO LYCEUM
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-12 text-sm font-semibold text-gray-400 uppercase tracking-widest">
            <Link to="#" className="hover:text-brand-navy transition-colors">Privacy Policy</Link>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <Link to="#" className="hover:text-brand-navy transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
