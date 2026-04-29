import Hero from '../components/Hero';
import Features from '../components/Features';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, ShieldCheck, ArrowRight, HelpCircle, FileText, Download, Verified } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Home() {
  const [latestResources, setLatestResources] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLatestResources(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Hero />
      <Features />

      {/* Latest Resources Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-brand-gold" />
                <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">Recently Contributed</span>
             </div>
             <Link to="/resources" className="text-brand-navy font-bold hover:underline flex items-center gap-1">
                View All <ArrowRight size={16} />
             </Link>
          </div>
          <h2 className="text-4xl font-serif font-bold text-brand-navy mb-12">Knowledge Shared <span className="italic">Recently</span></h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestResources.map((res) => (
              <motion.div 
                key={res.id}
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col border-t-4 border-t-brand-gold"
              >
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-1">
                        <FileText size={12} /> {res.type}
                    </span>
                    {res.verified && (
                        <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[10px] font-bold rounded flex items-center gap-1">
                            Verified
                        </span>
                    )}
                </div>
                
                <h4 className="text-xl font-bold text-brand-navy mb-auto leading-snug line-clamp-2 font-serif">
                    {res.title}
                </h4>
                
                <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-navy text-white text-[10px] flex items-center justify-center font-bold">
                            {res.authorName?.charAt(0) || 'S'}
                        </div>
                        <span className="text-xs font-semibold text-gray-600 truncate max-w-[100px]">{res.authorName || 'Scholar'}</span>
                    </div>
                    <button className="text-gray-400 hover:text-brand-navy">
                        <Download size={18} />
                    </button>
                </div>
              </motion.div>
            ))}
            {latestResources.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">Be the first to contribute to our library!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Community Teaser Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container-custom">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-6">
                   <div className="h-px w-10 bg-brand-gold" />
                   <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">For the student, by the student</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-serif font-bold text-brand-navy mb-8 leading-tight">
                  Enter the Digital <br/> <span className="text-brand-gold">Scholarly Commons</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-lg">
                  Beyond just resources, Khalsa Connect provides a safe, moderated environment for intellectual discourse. Chat with peers, receive instructor guidance, and share research in real-time.
                </p>
                
                <div className="space-y-6 mb-12">
                   {[
                     { icon: <MessageSquare size={18} />, text: 'Academic discussion threads' },
                     { icon: <Users size={18} />, text: 'Peer-to-peer mentorship' },
                     { icon: <ShieldCheck size={18} />, text: 'Moderated scholarship' }
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4 text-brand-navy font-semibold">
                        <div className="p-2 bg-gray-50 rounded-lg text-brand-gold">{item.icon}</div>
                        {item.text}
                     </div>
                   ))}
                </div>
                
                <Link to="/community/feed" className="btn-primary inline-flex items-center gap-3 group">
                   Visit the Community
                   <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gray-50 rounded-[2rem] p-4 lg:p-8 relative z-10">
                   <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                    alt="Students collaborating" 
                    className="rounded-2xl shadow-2xl"
                    referrerPolicy="no-referrer"
                   />
                   <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hidden md:block">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                           12
                        </div>
                        <div>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Now</p>
                           <h4 className="text-brand-navy font-bold">Students Discussing</h4>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-gold/5 rounded-full blur-3xl -z-10" />
              </motion.div>
           </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-gray-50/50" id="about">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08759df9a73?q=80&w=2070&auto=format&fit=crop" 
                alt="College building" 
                className="rounded-3xl shadow-xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-brand-gold" />
                <span className="text-brand-gold font-bold uppercase tracking-widest text-xs">Our Mission</span>
              </div>
              <h2 className="text-4xl font-serif font-bold text-brand-navy mb-8">Dedicated to <span className="italic text-brand-gold">Academic Excellence</span></h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                KhalsaCollege Connect was born out of a simple need: making high-quality academic resources accessible to every student within our campus walls. We believe that collective knowledge is the most powerful tool for success.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-10">
                <div>
                  <h4 className="text-brand-navy font-bold text-lg mb-2">Heritage</h4>
                  <p className="text-sm text-gray-500">Rooted in the rich history of Khalsa College, bringing tradition to the digital age.</p>
                </div>
                <div>
                  <h4 className="text-brand-navy font-bold text-lg mb-2">Community</h4>
                  <p className="text-sm text-gray-500">Built for students, by students, to foster a culture of help and mentorship.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-24 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container-custom relative z-10">
          <h3 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Ready to start your semester right?</h3>
          <p className="text-gray-300 mb-12 max-w-2xl mx-auto text-lg">
            Join thousands of students who are already using KhalsaCollege Connect to excel in their academics through collaboration.
          </p>
          <Link to="/community/feed" className="bg-brand-gold text-brand-navy px-12 py-5 rounded-xl font-bold text-lg hover:bg-white transition-all inline-block shadow-xl shadow-brand-gold/10">
            Join the Community
          </Link>
        </div>
      </section>

      {/* Small FAQ Button on the bottom corner */}
      <Link 
        to="/faq" 
        className="fixed bottom-6 right-6 z-[60] bg-white border border-gray-100 shadow-xl p-3 md:p-4 rounded-2xl text-brand-navy hover:bg-brand-navy hover:text-white transition-all group flex items-center gap-3 active:scale-95"
        title="Help & FAQ"
      >
        <span className="text-[10px] font-black uppercase tracking-widest pl-1 hidden sm:block">Need Help?</span>
        <HelpCircle size={20} className="text-brand-gold group-hover:text-white" />
      </Link>
    </>
  );
}
