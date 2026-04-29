import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  IdCard, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Settings,
  Bell,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { profile } = useAuth();

  if (!profile) return null;

  const stats = [
    { label: "Resources Shared", value: "12", icon: <BookOpen className="text-blue-500" size={20} /> },
    { label: "Community Rep", value: "450", icon: <Award className="text-orange-500" size={20} /> },
    { label: "Badges Earned", value: "4", icon: <ShieldCheck className="text-green-500" size={20} /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-20 pb-40">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          {/* Cover Area */}
          <div className="h-48 bg-brand-navy rounded-t-[2.5rem] relative">
            <div className="absolute inset-0 opacity-20">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="bg-white rounded-b-[2.5rem] shadow-sm border border-gray-100 p-8 pt-0 relative border-t-0">
             {/* Avatar */}
             <div className="relative -top-16 flex flex-col md:flex-row md:items-end gap-8 mb-[-2rem]">
                <div className="relative">
                  <img 
                    src={profile.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'} 
                    alt={profile.displayName || ''} 
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
                  />
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                </div>
                <div className="mb-4">
                  <h1 className="text-3xl font-serif font-bold text-brand-navy mb-1">{profile.displayName}</h1>
                  <p className="text-brand-gold font-bold uppercase tracking-widest text-[10px]">Active {profile.role}</p>
                </div>
                <div className="md:ml-auto mb-4 flex gap-3">
                   <button className="flex items-center gap-2 px-6 py-2 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                     <Settings size={18} />
                     <span className="text-sm">Settings</span>
                   </button>
                   <Link to="/community/feed" className="btn-primary flex items-center gap-2 px-6 py-2">
                     <Bell size={18} />
                     <span className="text-sm">Activity</span>
                   </Link>
                </div>
             </div>

             <div className="grid lg:grid-cols-3 gap-10 mt-20">
                {/* Left Column: Info */}
                <div className="lg:col-span-2 space-y-10">
                   <section>
                      <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                        <User size={16} />
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-gray-400"><IdCard size={20} /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Student ID</p>
                               <p className="font-bold text-brand-navy">{profile.studentId}</p>
                            </div>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-gray-400"><Phone size={20} /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                               <p className="font-bold text-brand-navy">{profile.phoneNumber}</p>
                            </div>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-gray-400"><Mail size={20} /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">College Email</p>
                               <p className="font-bold text-brand-navy">{profile.email}</p>
                            </div>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-gray-400"><Calendar size={20} /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Batch</p>
                               <p className="font-bold text-brand-navy">2024 - 2026</p>
                            </div>
                         </div>
                      </div>
                   </section>

                   <section>
                      <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                        <MapPin size={16} />
                        Academic Focus
                      </h3>
                      <div className="bg-gray-50 p-10 rounded-[2.5rem]">
                        <p className="text-gray-600 leading-relaxed italic">
                          "Currently focused on Physics research and contributing to the campus digital library project. Passionate about bringing traditional academic resources to the student community through modern technology."
                        </p>
                      </div>
                   </section>
                </div>

                {/* Right Column: Stats & Secondary */}
                <div className="space-y-8">
                   <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                      <h4 className="font-serif font-bold text-xl text-brand-navy">Performance</h4>
                      <div className="space-y-6">
                        {stats.map((stat, i) => (
                          <div key={i} className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                {stat.icon}
                                <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                             </div>
                             <span className="font-bold text-brand-navy">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="bg-brand-gold/10 rounded-[2rem] p-8 border border-brand-gold/20">
                      <h4 className="font-bold text-brand-navy text-sm uppercase tracking-widest mb-4">Quick Links</h4>
                      <div className="grid grid-cols-2 gap-4">
                         <Link to="/resources" className="text-xs font-bold text-brand-navy hover:underline">Digital Library</Link>
                         <Link to="/upload" className="text-xs font-bold text-brand-navy hover:underline">Upload Files</Link>
                         <Link to="/faq" className="text-xs font-bold text-brand-navy hover:underline">Help Center</Link>
                         <Link to="/community/chat" className="text-xs font-bold text-brand-navy hover:underline">Chat Channels</Link>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
