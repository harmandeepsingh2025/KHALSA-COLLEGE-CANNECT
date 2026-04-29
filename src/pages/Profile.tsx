import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
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
  Award,
  Save,
  X,
  Edit2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    displayName: profile?.displayName || '',
    email: profile?.email || '',
    phoneNumber: profile?.phoneNumber || '',
    studentId: profile?.studentId || '',
    academicYear: profile?.academicYear || '',
    bio: (profile as any)?.bio || 'Academic scholar at Khalsa College.'
  });

  const [resourceCount, setResourceCount] = useState(0);

  useEffect(() => {
    if (!profile?.uid) return;
    const q = query(collection(db, 'resources'), where('authorId', '==', profile.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setResourceCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [profile?.uid]);

  if (!profile) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Resources Shared", value: resourceCount.toString(), icon: <BookOpen className="text-blue-500" size={20} /> },
    { label: "Community Rep", value: (profile as any).reputation || "0", icon: <Award className="text-orange-500" size={20} /> },
    { label: "Verified Stats", value: (profile as any).verifiedCount || "0", icon: <ShieldCheck className="text-green-500" size={20} /> },
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
                <div className="mb-4 flex-grow">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.displayName}
                      onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                      className="text-3xl font-serif font-bold text-brand-navy mb-1 bg-gray-50 border-b-2 border-brand-gold outline-none px-2 w-full max-w-md"
                    />
                  ) : (
                    <h1 className="text-3xl font-serif font-bold text-brand-navy mb-1">{profile.displayName}</h1>
                  )}
                  <p className="text-brand-gold font-bold uppercase tracking-widest text-[10px]">Active {profile.role}</p>
                </div>
                <div className="md:ml-auto mb-4 flex gap-3">
                   {isEditing ? (
                     <>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 px-6 py-2 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <X size={18} />
                          <span className="text-sm">Cancel</span>
                        </button>
                        <button 
                          onClick={handleSave}
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-2 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navy/90 transition-all disabled:opacity-50"
                        >
                          {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                          <span className="text-sm">Store Profile</span>
                        </button>
                     </>
                   ) : (
                     <button 
                       onClick={() => setIsEditing(true)}
                       className="flex items-center gap-2 px-6 py-2 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                     >
                       <Edit2 size={18} />
                       <span className="text-sm">Edit Profile</span>
                     </button>
                   )}
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
                               {isEditing ? (
                                 <input 
                                   type="text" 
                                   value={editData.studentId}
                                   onChange={(e) => setEditData({...editData, studentId: e.target.value})}
                                   className="font-bold text-brand-navy bg-transparent border-b border-gray-200 outline-none w-full"
                                 />
                               ) : (
                                 <p className="font-bold text-brand-navy">{profile.studentId || 'Not set'}</p>
                               )}
                            </div>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-gray-400"><Phone size={20} /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number</p>
                               {isEditing ? (
                                 <input 
                                   type="text" 
                                   value={editData.phoneNumber}
                                   onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                                   className="font-bold text-brand-navy bg-transparent border-b border-gray-200 outline-none w-full"
                                   placeholder="+91 00000-00000"
                                 />
                               ) : (
                                 <p className="font-bold text-brand-navy">{profile.phoneNumber || 'Complete your profile'}</p>
                               )}
                            </div>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-gray-400"><Mail size={20} /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">College Email</p>
                               {isEditing ? (
                                 <input 
                                   type="email" 
                                   value={editData.email}
                                   onChange={(e) => setEditData({...editData, email: e.target.value})}
                                   className="font-bold text-brand-navy bg-transparent border-b border-gray-200 outline-none w-full"
                                   placeholder="name@khalsacollege.edu"
                                 />
                               ) : (
                                 <p className="font-bold text-brand-navy">{profile.email || 'Complete your profile'}</p>
                               )}
                            </div>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-gray-400"><Calendar size={20} /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Academic Year</p>
                               {isEditing ? (
                                 <select 
                                   value={editData.academicYear}
                                   onChange={(e) => setEditData({...editData, academicYear: e.target.value})}
                                   className="font-bold text-brand-navy bg-transparent border-b border-gray-200 outline-none w-full cursor-pointer"
                                 >
                                   <option value="">Select year</option>
                                   <option value="1st Year">1st Year</option>
                                   <option value="2nd Year">2nd Year</option>
                                   <option value="3rd Year">3rd Year</option>
                                 </select>
                               ) : (
                                 <p className="font-bold text-brand-navy">{profile.academicYear || 'Not set'}</p>
                               )}
                            </div>
                         </div>
                      </div>
                   </section>

                   <section>
                      <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                        <MapPin size={16} />
                        About & Biography
                      </h3>
                      <div className="bg-gray-50 p-10 rounded-[2.5rem]">
                        {isEditing ? (
                          <textarea 
                            value={editData.bio}
                            onChange={(e) => setEditData({...editData, bio: e.target.value})}
                            className="bg-transparent text-gray-600 leading-relaxed italic w-full min-h-[100px] outline-none"
                          />
                        ) : (
                          <p className="text-gray-600 leading-relaxed italic">
                            "{(profile as any).bio || 'Currently contributing to the campus community through digital resources.'}"
                          </p>
                        )}
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
