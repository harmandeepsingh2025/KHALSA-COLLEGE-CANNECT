import { BookOpen, FileText, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <BookOpen className="text-brand-navy" size={24} />,
    title: "Seniors' Notes",
    description: "Access comprehensive, high-quality notes vetted by top-performing seniors from previous semesters.",
    path: "/resources"
  },
  {
    icon: <FileText className="text-brand-navy" size={24} />,
    title: "PYQ Archive",
    description: "A meticulously organized library of Previous Year Questions to help you strategize your exam preparation effectively.",
    path: "/resources"
  },
  {
    icon: <Upload className="text-brand-navy" size={24} />,
    title: "Contribute Notes",
    description: "Share your own notes and resources with the community to help your peers excel.",
    path: "/upload"
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-brand-navy mb-6"
          >
            Empowering the Next Generation
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg leading-relaxed"
          >
            A structured platform designed to eliminate academic silos and promote knowledge sharing across all batches.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link 
                to={feature.path}
                className="card-premium h-full flex flex-col items-start gap-6 border-b-4 border-b-transparent hover:border-b-brand-gold group block cursor-pointer"
              >
                <div className="p-4 bg-gray-50 rounded-lg group-hover:bg-brand-gold-light transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-navy mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
