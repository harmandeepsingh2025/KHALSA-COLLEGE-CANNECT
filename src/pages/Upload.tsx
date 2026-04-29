import { Upload as UploadIcon, FileText, ChevronDown, CheckCircle2, X as CloseIcon } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useRef } from 'react';
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
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    department: 'Computer Science',
    semester: '1st Semester',
    academicYear: '2023-24',
    type: 'Class Notes'
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    // 200MB limit as requested
    const MAX_SIZE = 200 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("File size exceeds 200MB limit. Please upload a smaller document.");
      return;
    }
    setSelectedFile(file);
  };

  const generateSearchKeywords = (title: string) => {
    const words = title.toLowerCase().split(/\W+/).filter(w => w.length > 1);
    const keywords = new Set<string>();
    words.forEach(word => {
      for (let i = 1; i <= word.length; i++) {
        keywords.add(word.substring(0, i));
      }
    });
    return Array.from(keywords);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    
    setLoading(true);
    try {
      // Create searchable keywords from title
      const keywords = generateSearchKeywords(formData.title);
      
      await addDoc(collection(db, 'resources'), {
        ...formData,
        authorId: profile.uid,
        authorName: profile.displayName,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        keywords: keywords, // For advanced searching
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
                                <label className="label-field">Department</label>
                                <div className="relative">
                                    <select 
                                      className="input-field appearance-none cursor-pointer" 
                                      required
                                      value={formData.department}
                                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                                    >
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="Commerce">Commerce</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="label-field">Subject</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="input-field" 
                                    placeholder="e.g., Data Structures"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label-field">Semester</label>
                                <div className="relative">
                                    <select 
                                      className="input-field appearance-none cursor-pointer" 
                                      required
                                      value={formData.semester}
                                      onChange={(e) => setFormData({...formData, semester: e.target.value})}
                                    >
                                        <option value="1st Semester">1st Semester</option>
                                        <option value="2nd Semester">2nd Semester</option>
                                        <option value="3rd Semester">3rd Semester</option>
                                        <option value="4th Semester">4th Semester</option>
                                        <option value="5th Semester">5th Semester</option>
                                        <option value="6th Semester">6th Semester</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                            <div>
                                <label className="label-field">Academic Year</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.academicYear}
                                    onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                                    className="input-field" 
                                    placeholder="e.g., 2023-24"
                                />
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
                    
                    <div 
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-4 border-dashed rounded-3xl p-12 text-center group transition-all cursor-pointer ${
                        dragActive ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-100 hover:border-brand-gold/20'
                      } ${selectedFile ? 'border-green-100 bg-green-50/20' : ''}`}
                    >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={(e) => e.target.files && handleFiles(e.target.files[0])}
                          className="hidden" 
                        />
                        
                        {selectedFile ? (
                          <div className="text-center">
                            <div className="mb-6 inline-flex p-6 bg-green-100 text-green-600 rounded-2xl">
                              <CheckCircle2 size={32} />
                            </div>
                            <p className="text-xl font-bold text-brand-navy mb-1 truncate px-4">{selectedFile.name}</p>
                            <p className="text-gray-400 text-sm mb-4">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                              className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest flex items-center gap-1 mx-auto"
                            >
                              <CloseIcon size={14} /> Remove File
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="mb-6 inline-flex p-6 bg-brand-navy/5 rounded-2xl text-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all">
                                <UploadIcon size={32} />
                            </div>
                            <p className="text-xl font-bold text-brand-navy mb-2">Drop your document here</p>
                            <p className="text-gray-500 mb-8 text-sm">or click to browse your files</p>
                            
                            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 font-medium">
                                <span className="flex items-center gap-1.5"><FileText size={16} /> PDF</span>
                                <span className="flex items-center gap-1.5"><FileText size={16} /> Images</span>
                            </div>
                            <p className="mt-4 text-xs text-gray-300 italic">Max file size: 200MB (PDF/DOCX/IMG)</p>
                          </>
                        )}
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
