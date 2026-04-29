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
  FileText,
  User,
  Smile,
  Image as ImageIcon,
  Type
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
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
      limit(150)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      // Improved scrolling
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 200);
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
    
    const selection = text.substring(selectionStart, selectionEnd);

    if (type === 'bold') {
      formatted = `**${selection || 'text'}**`;
    } else if (type === 'italic') {
      formatted = `_${selection || 'text'}_`;
    } else if (type === 'link') {
      formatted = `[${selection || 'Title'}](https://)`;
    } else if (type === 'list') {
      formatted = `\n- ${selection || 'Item'}`;
    }

    const newValue = text.substring(0, selectionStart) + formatted + text.substring(selectionEnd);
    setInputValue(newValue);
    
    // Resume focus and set selection
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = selectionStart + formatted.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;
    if (isLocked && !isCreator) {
      alert("This chat is currently locked by the administrator.");
      return;
    }

    const tempMsg = inputValue;
    setInputValue("");
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'channels', channelId, 'messages'), {
        channelId,
        userId: user.uid,
        userName: profile?.displayName || user.displayName || 'Scholar',
        userAvatar: profile?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        userRole: profile?.role || 'Student',
        content: tempMsg,
        isInstructor: profile?.role === 'instructor',
        createdAt: serverTimestamp(),
      });
    } catch (error: any) {
       setInputValue(tempMsg); // Restore on error
       console.error("Chat Error:", error);
       alert("Failed to send message. Please ensure you are logged in and the chat is open.");
       handleFirestoreError(error, OperationType.CREATE, `channels/${channelId}/messages`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommunityLayout>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] overflow-hidden">
        {/* Chat Main Area */}
        <div className="flex-grow flex flex-col bg-[#E5DDD5] rounded-3xl border border-gray-200 shadow-2xl relative overflow-hidden">
          
          {/* Header - WhatsApp Style */}
          <div className="px-6 py-4 bg-brand-navy flex items-center justify-between z-20 shadow-md">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-gold border-2 border-brand-gold/20 shadow-inner">
                  <User size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">General Chat</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Official Khalsa Connect</p>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isCreator && (
                <button 
                  onClick={handleToggleLock}
                  className={`p-2.5 rounded-full transition-all group border ${
                    isLocked ? 'bg-red-500 text-white border-red-600' : 'bg-white/10 border-white/10 text-brand-gold hover:bg-white/20'
                  }`}
                  title={isLocked ? "Unlock Chat" : "Lock Chat"}
                >
                  {isLocked ? <XCircle size={18} /> : <Lock size={18} />}
                </button>
              )}
              <button className="p-2.5 bg-white/10 border border-white/10 text-white rounded-full hover:bg-white/20 transition-all">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef} 
            className="flex-grow overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"
          >
            <div className="flex justify-center mb-6">
               <span className="px-4 py-1 bg-brand-navy/60 text-[10px] font-bold text-white rounded-lg shadow-xl backdrop-blur-sm uppercase tracking-[0.2em]">
                  Messages are end-to-end encrypted for community safety
               </span>
            </div>

            {isLocked && !isCreator && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center my-6"
              >
                <div className="px-6 py-2 bg-white/90 border border-red-100 rounded-2xl shadow-lg flex items-center gap-2 text-red-500 backdrop-blur-sm">
                  <Lock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Chat Restricted to Read-Only</span>
                </div>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isSelf = message.userId === user?.uid;
                
                return (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[85%] md:max-w-[70%] ${isSelf ? 'flex-row-reverse' : ''}`}>
                      {!isSelf && (
                        <div className="shrink-0 mt-auto mb-1">
                          <img 
                            src={message.userAvatar} 
                            alt="" 
                            className="w-8 h-8 rounded-xl object-cover ring-2 ring-white shadow-md" 
                          />
                        </div>
                      )}
                      
                      <div className={`relative group ${isSelf ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`px-2 mb-0.5 flex items-center gap-2 ${isSelf ? 'flex-row-reverse' : ''}`}>
                          <h4 className="text-[9px] font-black text-brand-navy/60 uppercase tracking-tighter">{message.userName}</h4>
                        </div>
                        
                        <div className={`p-3.5 rounded-2xl shadow-xl relative min-w-[80px] ${
                          isSelf 
                          ? 'bg-[#E7FFDB] text-[#303030] rounded-tr-none' 
                          : 'bg-white text-[#303030] rounded-tl-none border border-gray-100'
                        }`}>
                          <div className={`text-sm leading-relaxed prose prose-sm max-w-none prose-slate`}>
                            <ReactMarkdown
                              components={{
                                a: ({node, ...props}) => <a {...props} className="text-blue-600 hover:underline font-bold" target="_blank" rel="noopener noreferrer" />,
                                strong: ({node, ...props}) => <strong {...props} className="font-bold" />,
                                p: ({node, ...props}) => <p {...props} className="m-0" />
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                          
                          <div className={`flex items-center gap-1 mt-1 justify-end`}>
                             <span className="text-[8px] text-gray-400 font-bold uppercase">
                                {message.createdAt?.toDate ? message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                             </span>
                             {isSelf && <div className="text-blue-400"><CheckCircle2 size={10} /></div>}
                          </div>

                          {/* Chat bubble tail effect using CSS classes */}
                          <div className={`absolute top-0 w-3 h-3 ${
                            isSelf 
                            ? 'bg-[#E7FFDB] -right-1 origin-top-left -rotate-45' 
                            : 'bg-white -left-1 origin-top-right rotate-45'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#F0F2F5] z-10">
            <div className={`max-w-4xl mx-auto flex items-end gap-2 transition-all ${isLocked && !isCreator ? 'opacity-50 grayscale' : ''}`}>
               
               <div className="flex-grow bg-white rounded-[1.5rem] shadow-sm border border-gray-200 p-1 flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1 px-3 py-1 border-b border-gray-50">
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); insertFormat('bold'); }} 
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand-navy"
                    >
                      <Bold size={14} />
                    </button>
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); insertFormat('italic'); }} 
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand-navy"
                    >
                      <Italic size={14} />
                    </button>
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); insertFormat('link'); }} 
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand-navy"
                    >
                      <Paperclip size={14} />
                    </button>
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); insertFormat('list'); }} 
                      type="button"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-brand-navy"
                    >
                      <List size={14} />
                    </button>
                    <div className="w-px h-3 bg-gray-100 mx-1" />
                    <button type="button" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><Smile size={15} /></button>
                  </div>
                  
                  <textarea 
                    ref={textareaRef}
                    placeholder={isLocked && !isCreator ? "Locked" : "Type a message..."}
                    value={inputValue}
                    disabled={isLocked && !isCreator}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 px-5 min-h-[45px] max-h-40 resize-none placeholder:text-gray-400"
                  />
               </div>
               
               <button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isSubmitting || (isLocked && !isCreator)}
                  className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md group ${
                    !inputValue.trim() || isSubmitting 
                    ? 'bg-gray-300 text-white cursor-not-allowed' 
                    : 'bg-[#00A884] text-white hover:bg-[#008F6F] active:scale-95'
                  }`}
               >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={20} className={inputValue.trim() ? "translate-x-0.5" : ""} />
                  )}
               </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-72 space-y-6 flex-shrink-0">
          {/* My Profile */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xl text-center">
             <div className="relative inline-block mb-4">
                <img 
                  src={profile?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                  alt="" 
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg ring-4 ring-gray-50" 
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-lg" />
             </div>
             
             <h5 className="font-bold text-brand-navy truncate text-sm">{profile?.displayName || 'User'}</h5>
             <p className="text-[10px] text-brand-gold font-black uppercase tracking-widest mt-1">{profile?.role || 'Member'}</p>
             
             <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                   <span className="text-gray-400 font-bold uppercase">Student ID</span>
                   <span className="font-bold text-brand-navy">{profile?.studentId || 'N/A'}</span>
                </div>
                <Link 
                  to="/profile" 
                  className="block w-full py-2 bg-gray-50 hover:bg-brand-navy hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-navy transition-all"
                >
                  Edit Profile
                </Link>
             </div>
          </div>

          {/* Quick Info */}
          <div className="bg-brand-dark rounded-3xl p-6 text-white shadow-xl">
             <div className="flex items-center gap-2 mb-4 text-brand-gold">
                <AlertTriangle size={14} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Guidelines</h4>
             </div>
             <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                Maintain academic decorum. Spam or inappropriate behavior will lead to account suspension.
             </p>
          </div>
        </div>
      </div>
    </CommunityLayout>
  );
}


