import { Search, ChevronDown, Download, Verified, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  department?: string;
  semester?: string;
  academicYear: string;
  type: string;
  authorName: string;
  authorId: string;
  createdAt: any;
  verified?: boolean;
}

const disciplines = [
  {
    title: "Computer Science",
    count: "Dynamic",
    description: "DSA, Web Technologies, OS, and semester-wise PYQs.",
    featured: true,
    bg: "bg-brand-navy",
    textColor: "text-white"
  },
  {
    title: "Commerce",
    count: "Dynamic",
    description: "Accounting, Business Studies, Marketing, and Economics.",
    bg: "bg-white",
    textColor: "text-brand-navy"
  },
  {
    title: "Other Departments",
    count: "Coming Soon",
    description: "Expanding our archive to include Arts, Sciences, and more.",
    bg: "bg-gray-50",
    textColor: "text-gray-400",
    isPlaceholder: true
  }
];

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'resources');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredResources = resources.filter(res => {
    const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    const titleLower = res.title.toLowerCase();
    const subjectLower = (res.subject || '').toLowerCase();
    const deptLower = (res.department || '').toLowerCase();
    
    const matchesSearch = searchTerms.length === 0 || searchTerms.every(term => 
      titleLower.includes(term) || subjectLower.includes(term) || deptLower.includes(term)
    );
    
    const matchesFilter = filterType === 'All' || res.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (res: Resource) => {
    const confirm = window.confirm(`Preparation for download: ${res.title}. This is a community shared document. Proceed?`);
    if (confirm) {
      // Simulate file download
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `${res.title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      
      alert(`Initiating secure download for ${res.title}. In production, this would fetch from Firebase Storage.`);
      
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    }
  };

  return (
    <div className="pt-20">
      {/* Header Section */}
      <section className="bg-white py-16">
        <div className="container-custom text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-brand-navy mb-6 font-serif"
          >
            Academic Resource Center
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto"
          >
            Access collaborative study materials, previous year question papers (PYQs), and comprehensive lecture notes shared by the community.
          </motion.p>
          
          <div className="max-w-4xl mx-auto relative group">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-lg p-2 gap-2 group-focus-within:border-brand-gold transition-all">
              <Search className="ml-4 text-gray-400" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subject, topic..." 
                className="flex-grow py-3 px-2 outline-none text-gray-700"
              />
              <button className="bg-brand-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-navy/90 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Discipline Section */}
      <section className="py-20 bg-gray-50/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-brand-navy font-serif">Browse by Discipline</h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {disciplines.map((d, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className={`${d.bg} ${d.textColor} rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group transition-all`}
              >
                {d.featured && (
                  <span className="inline-block px-3 py-1 bg-brand-gold text-brand-navy font-bold text-[10px] uppercase tracking-widest rounded mb-6">
                    Featured Department
                  </span>
                )}
                {!d.featured && (
                    <div className="mb-6 p-3 bg-brand-gold/10 rounded-lg inline-block text-brand-gold">
                        <FileText size={24} />
                    </div>
                )}
                
                <h3 className="text-2xl font-bold mb-3">{d.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{d.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Resources */}
      <section className="py-24 bg-white min-h-[400px]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <h2 className="text-3xl font-bold text-brand-navy font-serif">Library Directory</h2>
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                {['All', 'Class Notes', 'PYQ', 'Assignment'].map(type => (
                  <button 
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-6 py-2 rounded-md font-semibold transition-all ${
                      filterType === type 
                      ? 'bg-white text-brand-navy shadow-sm' 
                      : 'text-gray-500 hover:text-brand-navy'
                    }`}
                  >
                    {type}
                  </button>
                ))}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredResources.map((res) => (
                <motion.div 
                  key={res.id}
                  whileHover={{ y: -5 }}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col border-t-4 border-t-gray-50 hover:border-t-brand-gold"
                >
                  <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">
                            {res.type}
                        </span>
                        <span className="text-[9px] uppercase font-bold tracking-tighter text-gray-400">
                            {res.department} • {res.semester}
                        </span>
                      </div>
                      {res.verified && (
                          <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[10px] font-bold rounded flex items-center gap-1">
                              <Verified size={10} /> Verified
                          </span>
                      )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-brand-navy mb-auto leading-snug line-clamp-2">
                      {res.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">{res.subject}</p>
                  
                  <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-brand-navy/10 text-brand-navy text-[10px] flex items-center justify-center font-bold border border-brand-navy/5">
                              {res.authorName?.charAt(0) || 'S'}
                          </div>
                          <span className="text-xs font-semibold text-gray-600 truncate max-w-[100px]">{res.authorName || 'Scholar'}</span>
                      </div>
                      <button 
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-brand-navy hover:text-white transition-all shadow-sm"
                        onClick={() => handleDownload(res)}
                      >
                          <Download size={14} />
                      </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
               <FileText className="mx-auto text-gray-200 mb-4" size={48} />
               <p className="text-gray-400 font-bold">No resources found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
