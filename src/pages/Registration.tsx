import React, { useState } from 'react';
import { User, ChevronDown, IdCard, GraduationCap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Registration() {
  const navigate = useNavigate();
  const { login, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    studentId: '',
    academicYear: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await login();
      
      await updateProfile({
        ...formData,
        role: 'student',
        email: newUser.email || '',
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.displayName}`,
      }, newUser.uid);
      
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/admin-restricted-operation') {
        alert('CRITICAL: Anonymous Authentication is disabled. Please go to your Firebase Console > Authentication > Sign-in method and enable "Anonymous".');
      } else {
        alert(`Registration failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Decoration Side */}
      <div className="lg:w-[45%] relative bg-brand-navy hidden lg:flex flex-col justify-end p-20 overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1541339907198-e08759df9a73?q=80&w=2070&auto=format&fit=crop" 
                alt="College building" 
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-90" />
        </div>
        
        <div className="relative z-10">
            <div className="mb-12 inline-flex p-4 bg-white/10 rounded-2xl text-white backdrop-blur-sm border border-white/20">
                <GraduationCap size={48} />
            </div>
            <h1 className="text-6xl font-bold text-white mb-8 leading-tight font-serif">
                For the student, by the student <br />
                Awaits.
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-md">
                Join a community where traditional academic prestige meets fluid, collaborative digital connection.
            </p>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
      </div>

      {/* Right Form Side */}
      <div className="flex-grow flex items-center justify-center p-8 md:p-20 bg-white">
        <div className="w-full max-w-lg">
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                <div className="p-2 bg-brand-navy rounded-lg text-white">
                    <GraduationCap size={24} />
                </div>
                <span className="text-2xl font-bold text-brand-navy tracking-tight">KhalsaCollege Connect</span>
            </Link>
            <h2 className="text-4xl font-bold text-brand-navy mb-4 font-serif">Student Registration</h2>
            <p className="text-gray-500">Enter your academic details to get started.</p>
          </div>
          
          <form className="space-y-8" onSubmit={handleRegister}>
            <div className="space-y-6">
                <div>
                    <label className="label-field text-base">Full Name</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <User size={20} />
                        </div>
                        <input 
                            type="text" 
                            required
                            value={formData.displayName}
                            onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                            className="input-field pl-12" 
                            placeholder="e.g. Gurpreet Singh"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="label-field text-base">College ID</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <IdCard size={20} />
                        </div>
                        <input 
                            type="text" 
                            required
                            value={formData.studentId}
                            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                            className="input-field pl-12" 
                            placeholder="e.g. KC-2024-001"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="label-field text-base">Academic Year</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <GraduationCap size={20} />
                        </div>
                        <select 
                          className="input-field pl-12 appearance-none cursor-pointer" 
                          required
                          value={formData.academicYear}
                          onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                        >
                            <option value="">Select your current year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    </div>
                </div>
            </div>
            
            <button 
                type="submit"
                disabled={loading}
                className="w-full bg-brand-navy text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-brand-navy/20 hover:bg-brand-navy/90 transition-all group disabled:opacity-50"
            >
                {loading ? 'Registering...' : 'Register Account'}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
            
            <p className="text-center text-gray-500 font-medium">
                Already part of the community? <button type="button" onClick={() => navigate('/')} className="text-brand-navy font-bold hover:underline">Sign in here</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
