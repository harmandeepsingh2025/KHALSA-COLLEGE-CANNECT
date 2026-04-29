import { Upload as UploadIcon, FileText, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

export default function Upload() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    academicYear: '',
    type: 'Class Notes'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'resources'), {
        ...formData,
        authorId: profile.uid,
        authorName: profile.displayName,
        createdAt: serverTimestamp(),
        verified: false
      });
      setSuccess(true);
      setTimeout(() => navigate('/resources'), 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'resources');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] text-center shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-navy mb-2">Upload Successful!</h2>
          <p className="text-gray-500">Your resource has been added to the community archive.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50/30">
      <section className="py-20">
        <div className="container-custom">
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-brand-navy mb-4 font-serif">Contribute to the Archive</h1>
            <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
              Share your knowledge with the next generation. Upload your comprehensive notes, past year questions, and study materials to enrich our academic community.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Form Side */}
            <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-1 px-8 py-6 border-b border-gray-50 bg-white">
                         <h2 className="text-2xl font-bold text-brand-navy mb-2">Resource Details</h2>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        <div>
                            <label className="label-field">Document Title</label>
                            <input 
                                type="text" 
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="input-field" 
                                placeholder="e.g., Advanced Calculus Final Notes 2023"
                            />
                        </div>
                        
                        <div>
                            <label className="label-field">Description (Optional)</label>
                            <textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="input-field min-h-[150px] resize-none" 
                                placeholder="Briefly describe the contents of this document..."
                            />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-field">Subject</label>
                                <div className="relative">
                                    <select 
                                      className="input-field appearance-none cursor-pointer" 
                                      required
                                      value={formData.subject}
                                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    >
                                        <option value="">Select a subject</option>
                                        <option>Computer Science</option>
                                        <option>Mathematics</option>
                                        <option>Physics</option>
                                        <option>Chemistry</option>
                                        <option>Commerce</option>
                                        <option>English</option>
                                        <option>Punjabi</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="label-field">Academic Year</label>
                                <div className="relative">
                                    <select 
                                      className="input-field appearance-none cursor-pointer" 
                                      required
                                      value={formData.academicYear}
                                      onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                                    >
                                        <option value="">Select year</option>
                                        <option>1st Year</option>
                                        <option>2nd Year</option>
                                        <option>3rd Year</option>
                                        <option>Post Graduate</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="label-field mb-4">Resource Type</label>
                            <div className="flex flex-wrap gap-4">
                                {['Class Notes', 'PYQ', 'Assignment'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({...formData, type})}
                                        className={`px-8 py-2.5 rounded-lg border-2 font-semibold transition-all ${
                                            formData.type === type 
                                            ? 'bg-brand-navy border-brand-navy text-white shadow-md' 
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-brand-gold/30'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Upload Side */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-brand-navy mb-8">Upload Document</h2>
                    
                    <div className="border-4 border-dashed border-gray-100 rounded-3xl p-12 text-center group hover:border-brand-gold/20 transition-all cursor-pointer">
                        <div className="mb-6 inline-flex p-6 bg-brand-navy/5 rounded-2xl text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all">
                            <UploadIcon size={32} />
                        </div>
                        <p className="text-xl font-bold text-brand-navy mb-2">Select file to contribute</p>
                        <p className="text-gray-500 mb-8 text-sm">PDF, DOCX, or Images accepted</p>
                        
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 font-medium">
                            <span className="flex items-center gap-1.5"><FileText size={16} /> PDF</span>
                            <span className="flex items-center gap-1.5"><FileText size={16} /> Image</span>
                        </div>
                        <p className="mt-4 text-xs text-gray-300">Max file size: 25MB</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-end gap-4 font-serif">
                    <button type="button" onClick={() => navigate('/')} className="px-10 py-3 font-bold text-gray-600 hover:text-brand-navy transition-colors">
                        Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-brand-navy text-white px-10 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-brand-navy/20 hover:bg-brand-navy/90 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <UploadIcon size={18} />
                        )}
                        {loading ? 'Uploading...' : 'Submit Resource'}
                    </button>
                </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
