import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  BookOpen, 
  ExternalLink,
  FileText,
  ArrowRight,
  Plus,
  Send,
  X
} from 'lucide-react';
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
  limit 
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

const trending = [
  { group: "STUDY GROUPS", title: "Midterm Prep: Organic Chemistry", participants: "45 active participants" },
  { group: "CAMPUS EVENTS", title: "Annual Heritage Debate Finals", participants: "Starting tomorrow at 6 PM" },
  { group: "CAREER", title: "Tech Internship Drive 2024", participants: "12 new postings added" }
];

export default function CommunityFeed() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    }, (error) => {
       handleFirestoreError(error, OperationType.GET, 'posts');
    });

    return () => unsubscribe();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user || !profile) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: profile.displayName || user.displayName || 'Anonymous',
        authorAvatar: profile.photoURL || user.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
        authorRole: profile.role,
        content: newPostContent,
        tags: ["#General"],
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });
      setNewPostContent("");
      setShowPostModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommunityLayout>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* Feed Columns */}
        <div className="flex-grow space-y-8">
          {/* Create Post Trigger */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4">
             <img 
               src={user?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'} 
               alt="" 
               className="w-12 h-12 rounded-full object-cover" 
             />
             <button 
               onClick={() => setShowPostModal(true)}
               className="flex-grow bg-gray-50 hover:bg-gray-100 text-left px-6 py-3 rounded-full text-gray-500 transition-colors"
             >
               Share your academic findings, {profile?.displayName?.split(' ')[0]}...
             </button>
          </div>

          {posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={post.authorAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-brand-navy">{post.authorName}</h4>
                    <p className="text-xs text-gray-400 font-medium">{post.authorRole} • {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-brand-navy">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              {/* Post Content */}
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {post.content}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags?.map((tag: string) => (
                    <span key={tag} className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      tag === 'Featured' ? 'bg-brand-gold text-brand-navy' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Post Visuals */}
              {post.imageUrl && (
                <div className="relative aspect-video">
                  <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              
              {/* Post Footer */}
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-8">
                   <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold transition-colors">
                     <Heart size={20} />
                     <span className="text-sm">{post.likesCount || 0}</span>
                   </button>
                   <button className="flex items-center gap-2 text-gray-400 hover:text-brand-navy font-bold transition-colors">
                     <MessageCircle size={20} />
                     <span className="text-sm">{post.commentsCount || 0}</span>
                   </button>
                   <button className="flex items-center gap-2 text-gray-400 hover:text-brand-navy font-bold transition-colors">
                     <Share2 size={20} />
                   </button>
                </div>
                <button className="text-gray-400 hover:text-brand-gold transition-colors">
                  <Bookmark size={20} />
                </button>
              </div>
            </motion.div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
               <p className="text-gray-400">No academic posts yet. Be the first to share!</p>
            </div>
          )}
        </div>

        {/* Right Sidebar Columns */}
        <div className="w-full lg:w-96 space-y-8">
           {/* User Profile Card */}
           <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
             <div className="flex items-center gap-4 mb-6">
                <img 
                  src={profile?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop'} 
                  alt="" 
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div>
                   <h3 className="font-bold text-brand-navy leading-tight">{profile?.displayName}</h3>
                   <p className="text-[10px] text-brand-gold font-bold uppercase tracking-widest">{profile?.role}</p>
                </div>
             </div>
             <div className="space-y-4 border-t border-gray-50 pt-6 mb-8">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID</span>
                   <span className="text-xs font-bold text-brand-navy">{profile?.studentId}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone</span>
                   <span className="text-xs font-bold text-brand-navy">{profile?.phoneNumber}</span>
                </div>
             </div>
             <Link to="/profile" className="w-full btn-secondary inline-flex items-center justify-center py-3 text-sm font-bold">
                View Full Profile
             </Link>
           </div>

           {/* Trending Section */}
           <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xl font-bold text-brand-navy mb-8 font-serif">Trending Discussions</h3>
              <div className="space-y-8">
                {trending.map((item, index) => (
                  <div key={index} className="group cursor-pointer">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{item.group}</p>
                    <h4 className="font-bold text-brand-navy group-hover:text-brand-gold transition-colors leading-snug mb-1">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.participants}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 text-sm font-bold text-brand-navy hover:underline">
                View All Trends
              </button>
           </div>
           
           {/* Guidelines Card */}
           <div className="bg-brand-navy rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <BookOpen size={100} className="text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <BookOpen className="text-brand-gold" size={24} />
                   <h3 className="text-white font-bold text-xl font-serif tracking-tight">Community Guidelines</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-8">
                  Khalsa Connect is a space for scholarly discourse and professional networking. Please maintain academic integrity and respectful communication in all interactions.
                </p>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  Read Full Policy
                  <ArrowRight size={16} className="text-brand-gold" />
                </button>
              </div>
           </div>
           
           {/* Footer Small */}
           <div className="text-center">
              <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                <Link to="#">Privacy</Link>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <Link to="#">Terms</Link>
                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                <Link to="#">Help</Link>
              </div>
              <p className="text-[10px] text-gray-300 uppercase tracking-widest font-medium">© 2024 Khalsa College</p>
           </div>
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
           >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                 <h3 className="text-lg font-bold text-brand-navy">Create Academic Post</h3>
                 <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-brand-navy">
                   <X size={24} />
                 </button>
              </div>
              <form onSubmit={handleCreatePost} className="p-8">
                 <textarea 
                   autoFocus
                   placeholder="What are you researching or learning today?"
                   value={newPostContent}
                   onChange={(e) => setNewPostContent(e.target.value)}
                   className="w-full h-40 bg-gray-50 rounded-2xl p-6 border-none focus:ring-2 focus:ring-brand-gold text-gray-700 resize-none placeholder:text-gray-300"
                 />
                 <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-400">
                       <button type="button" className="hover:text-brand-navy transition-colors"><FileText size={20} /></button>
                       <button type="button" className="hover:text-brand-navy transition-colors"><Bookmark size={20} /></button>
                    </div>
                    <button 
                      type="submit" 
                      disabled={!newPostContent.trim() || isSubmitting}
                      className="btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Posting...' : 'Share with Peers'}
                      <Send size={18} />
                    </button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </CommunityLayout>
  );
}

