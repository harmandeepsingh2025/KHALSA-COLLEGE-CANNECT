import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Paperclip, 
  Bold, 
  Italic, 
  List, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CommunityLayout from '../components/CommunityLayout';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit,
  doc,
  setDoc
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

export default function CommunityChat() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const channelId = "general-section-chat"; 

  const isCreator = user?.email === 'harmandeepsingh7814@gmail.com';

  useEffect(() => {
    // Listen for channel status (locks)
    const channelDoc = onSnapshot(doc(db, 'channels', channelId), (snap) => {
      if (snap.exists()) {
        setIsLocked(snap.data().isLocked || false);
      }
    });

    const q = query(
      collection(db, 'channels', channelId, 'messages'), 
      orderBy('createdAt', 'asc'), 
      limit(100)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `channels/${channelId}/messages`);
    });

    return () => {
      channelDoc();
      unsubscribe();
    };
  }, []);

  const handleToggleLock = async () => {
    if (!isCreator) return;
    try {
      await setDoc(doc(db, 'channels', channelId), {
        isLocked: !isLocked,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Lock error:", error);
    }
  };

  const insertFormat = (type: string) => {
    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd } = textareaRef.current;
    const text = inputValue;
    let formatted = '';
    
    if (type === 'bold') {
      formatted = `**${text.substring(selectionStart, selectionEnd) || 'text'}**`;
    } else if (type === 'italic') {
      formatted = `_${text.substring(selectionStart, selectionEnd) || 'text'}_`;
    } else if (type === 'link') {
      formatted = `[${text.substring(selectionStart, selectionEnd) || 'Title'}](https://)`;
    } else if (type === 'list') {
      formatted = `\n- ${text.substring(selectionStart, selectionEnd) || 'Item'}`;
    }

    const newValue = text.substring(0, selectionStart) + formatted + text.substring(selectionEnd);
    setInputValue(newValue);
    
    // Resume focus
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;
    if (isLocked && !isCreator) {
      alert("This chat is currently locked by the administrator.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'channels', channelId, 'messages'), {
        channelId,
        userId: user.uid,
        userName: profile?.displayName || user.displayName || 'Scholar',
        userAvatar: profile?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        userRole: profile?.role || 'Student',
        content: inputValue,
        isInstructor: profile?.role === 'instructor',
        createdAt: serverTimestamp(),
      });
      setInputValue("");
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, `channels/${channelId}/messages`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommunityLayout>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 h-[calc(100vh-10rem)] overflow-hidden">
        {/* Chat Main Area */}
        <div className="flex-grow flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          {/* Channel Header */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div>
               <h2 className="text-2xl font-serif font-bold text-brand-navy">General Chat</h2>
               <div className="flex items-center gap-2 mt-1">
                 <AlertTriangle size={14} className="text-brand-gold" />
                 <p className="text-[10px] font-bold text-brand-navy uppercase tracking-[0.2em]">Khalsa College Connect Official</p>
               </div>
            </div>
            
            {/* Lock Control (Admin Only) */}
            {isCreator && (
              <button 
                onClick={handleToggleLock}
                className="flex items-center gap-3 bg-gray-50 hover:bg-brand-navy hover:text-white px-6 py-2 rounded-xl transition-all group border border-gray-100"
              >
                {isLocked ? (
                  <XCircle size={18} className="text-red-500 group-hover:text-white" />
                ) : (
                  <Lock size={18} className="text-brand-gold group-hover:text-white" />
                )}
                <span className="text-xs font-bold uppercase tracking-widest">{isLocked ? 'Unlock Chat' : 'Lock Chat'}</span>
              </button>
            )}

            {!isCreator && isLocked && (
              <div className="flex items-center gap-2 px-6 py-2 bg-red-50 rounded-xl text-red-500 border border-red-100">
                <Lock size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Locked</span>
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-6 scroll-smooth">
            {isLocked && (
              <div className="text-center mb-10">
                <span className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 border border-red-100 rounded-full text-[10px] font-bold text-red-600 uppercase tracking-widest">
                  <Lock size={12} />
                  Chat is temporarily restricted to Read-Only by Admin
                </span>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isSelf = message.userId === user?.uid;
                // Simple highlight for @mentions
                const renderContent = (content: string) => {
                  const parts = content.split(/(@\w+)/g);
                  return parts.map((part, i) => 
                    part.startsWith('@') ? <span key={i} className="text-blue-600 font-bold bg-blue-100/50 px-1 rounded">{part}</span> : part
                  );
                };

                return (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, x: isSelf ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex gap-6 ${isSelf ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-brand-navy shadow-sm overflow-hidden">
                        <img src={message.userAvatar} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    
                    <div className={`max-w-[70%] group ${isSelf ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-3 mb-2 ${isSelf ? 'flex-row-reverse' : ''}`}>
                        <h4 className="font-bold text-brand-navy text-sm">{message.userName}</h4>
                        <span className="text-[10px] text-gray-300 font-bold">
                          {message.createdAt?.toDate ? message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                        </span>
                      </div>
                      
                      <div className={`relative p-6 rounded-2xl shadow-sm text-sm leading-relaxed ${
                        isSelf 
                        ? 'bg-blue-50 text-brand-navy rounded-tr-none border border-blue-100/50' 
                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                      }`}>
                        {renderContent(message.content)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-50 bg-white">
            <form onSubmit={handleSendMessage} className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-xl shadow-gray-50 ${(isLocked && !isCreator) ? 'opacity-50 pointer-events-none' : ''}`}>
               <textarea 
                ref={textareaRef}
                placeholder={isLocked && !isCreator ? "This chat is locked..." : "Share your thoughts or tag someone with @name..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-4 h-24 md:h-32 resize-none placeholder:text-gray-300"
               />
               
               <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-4 text-gray-300">
                    <button type="button" onClick={() => insertFormat('bold')} className="hover:text-brand-navy transition-colors"><Bold size={18} /></button>
                    <button type="button" onClick={() => insertFormat('italic')} className="hover:text-brand-navy transition-colors"><Italic size={18} /></button>
                    <button type="button" onClick={() => insertFormat('link')} className="hover:text-brand-navy transition-colors"><Paperclip size={18} /></button>
                    <button type="button" onClick={() => insertFormat('list')} className="hover:text-brand-navy transition-colors"><List size={18} /></button>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <p className="text-[10px] text-gray-300 font-bold hidden sm:block">Press Enter to send</p>
                    <button 
                      type="submit"
                      disabled={!inputValue.trim() || isSubmitting || (isLocked && !isCreator)}
                      className={`btn-primary flex items-center gap-2 px-8 py-3 text-sm transition-all ${
                        !inputValue.trim() || isSubmitting ? 'opacity-50 grayscale cursor-not-allowed' : ''
                      }`}
                    >
                       {isSubmitting ? 'Sending...' : 'Post Message'}
                       <Send size={16} />
                    </button>
                  </div>
               </div>
            </form>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-96 space-y-8 flex-shrink-0">
          {/* Active Members */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-brand-navy font-serif">Your Community Details</h3>
             </div>
             <div className="space-y-6">
               <div className="flex flex-col gap-6">
                 <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={profile?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'} 
                        alt="" 
                        className="w-12 h-12 rounded-xl object-cover" 
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-gold border-2 border-white rounded-full" />
                    </div>
                    <div>
                       <h5 className="text-sm font-bold text-brand-navy group-hover:text-brand-gold transition-colors">{profile?.displayName || 'Anonymous'}</h5>
                       <p className="text-[10px] text-brand-gold font-bold uppercase tracking-widest">{profile?.role}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                       <span className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.1em]">Student ID</span>
                       <span className="text-[10px] font-black text-brand-navy">{profile?.studentId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.1em]">Phone</span>
                       <span className="text-[10px] font-black text-brand-navy">{profile?.phoneNumber}</span>
                    </div>
                 </div>
                 
                 <Link to="/profile" className="text-center py-2 text-[10px] font-bold text-brand-navy hover:underline">
                    Manage My Profile
                 </Link>
               </div>
             </div>
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
}

