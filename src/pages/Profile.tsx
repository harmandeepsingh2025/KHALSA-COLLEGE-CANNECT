import React, { useState, useEffect, useRef } from 'react';
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
  Edit2,
  Camera,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editData, setEditData] = useState({
    displayName: profile?.displayName || '',
    email: profile?.email || '',
    phoneNumber: profile?.phoneNumber || '',
    studentId: profile?.studentId || '',
    academicYear: profile?.academicYear || '',
    photoURL: profile?.photoURL || '',
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB limit as requested)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      alert('Selfie size should not exceed 10 MB to maintain the database quickly.');
      return;
    }

    setUploading(true);
    
    try {
      // Since Firestore has a 1MB limit for the whole document, 
      // we'll compress/resize the image to ensure it fits comfortably 
      // as a base64 string while staying within your request boundaries.
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension of 800px for profile photo (plenty for high quality cards)
          const MAX_DIM = 800;
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to 0.7 quality for balance of space/detail
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setEditData(prev => ({ ...prev, photoURL: compressedBase64 }));
          setUploading(false);
          
          // If we aren't in explicit editing mode, we can save immediately
          if (!isEditing) {
            updateProfile({ photoURL: compressedBase64 });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File upload failed:', error);
      alert('Failed to process image');
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(editData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setEditData({
      displayName: profile?.displayName || '',
      email: profile?.email || '',
      phoneNumber: profile?.phoneNumber || '',
      studentId: profile?.studentId || '',
      academicYear: profile?.academicYear || '',
      photoURL: profile?.photoURL || '',
      bio: (profile as any)?.bio || 'Academic scholar at Khalsa College.'
    });
    setIsEditing(true);
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
             {/* Avatar Section */}
             <div className="relative -top-16 flex flex-col md:flex-row md:items-end gap-8 mb-[-2rem]">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                    <img 
                      src={editData.photoURL || profile.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'} 
                      alt={profile.displayName || ''} 
                      className="w-full h-full object-cover"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {/* Photo Upload Trigger */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-gold text-brand-navy rounded-xl border-4 border-white flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-lg group-hover:bg-brand-navy group-hover:text-white"
                    title="Upload Selfie"
                  >
                    <Camera size={20} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div className="absolute top-2 left-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" title="Online Status" />
                </div>

                <div className="mb-4 flex-grow">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editData.displayName}
                      onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                      className="text-3xl font-serif font-bold text-brand-navy mb-1 bg-gray-50 border-b-2 border-brand-gold outline-none px-2 w-full max-w-md"
                      placeholder="Enter Full Name"
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
                          <span className="text-sm">{loading ? 'Storing...' : 'Store Profile'}</span>
                        </button>
                     </>
                   ) : (
                     <button 
                       onClick={startEditing}
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
                                   placeholder="KC-2024-XXX"
                                 />
                               ) : (
                                 <p className="font-bold text-brand-navy">{profile.studentId || 'Not set'}</p>
                               )}
                            </div>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-gray-400"><Phone size={20} /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mobile Number (Optional)</p>
                               {isEditing ? (
                                 <input 
                                   type="text" 
                                   value={editData.phoneNumber}
                                   onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                                   className="font-bold text-brand-navy bg-transparent border-b border-gray-200 outline-none w-full"
                                   placeholder="+91 00000-00000"
                                 />
                               ) : (
                                 <p className="font-bold text-brand-navy">{profile.phoneNumber || 'Add mobile number'}</p>
                               )}
                            </div>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl text-gray-400"><Mail size={20} /></div>
                            <div>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gmail / College Email (Optional)</p>
                               {isEditing ? (
                                 <input 
                                   type="email" 
                                   value={editData.email}
                                   onChange={(e) => setEditData({...editData, email: e.target.value})}
                                   className="font-bold text-brand-navy bg-transparent border-b border-gray-200 outline-none w-full"
                                   placeholder="name@gmail.com"
                                 />
                               ) : (
                                 <p className="font-bold text-brand-navy">{profile.email || 'Add email address'}</p>
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
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <p className="text-gray-600 leading-relaxed italic">
                            "{(profile as any).bio || 'Contributing to the scholarly community at Khalsa College.'}"
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
