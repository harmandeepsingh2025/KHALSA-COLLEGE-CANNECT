import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, HelpCircle, MessageCircle, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "How do I upload academic resources?",
    answer: "You can upload resources by navigating to the 'Upload' section from the main menu. You'll need to be signed in to your student account to contribute files like PDFs, notes, or research papers."
  },
  {
    question: "Is there a limit to the file size for uploads?",
    answer: "Currently, we support files up to 25MB. If you have larger research datasets, please contact the department administrator to facilitate the upload."
  },
  {
    question: "How can I join the specific department chat?",
    answer: "Once you join the Khalsa College Connect community, you can access various academic channels. Most channels are open based on your department selection during registration."
  },
  {
    question: "Are the resources verified by faculty?",
    answer: "Resources with the 'Verified' badge have been reviewed by instructors or department heads. We encourage peer review, so you can also see comments and ratings from other students."
  },
  {
    question: "I lost my ID card, can I still use the app?",
    answer: "Yes! Your digital profile on Khalsa College Connect is linked to your student credentials. You don't need your physical ID card to access the digital library or community feed."
  }
];

export default function FAQ() {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center p-3 bg-brand-gold/10 rounded-2xl text-brand-gold mb-6">
              <HelpCircle size={32} />
            </div>
            <h1 className="text-4xl font-serif font-bold text-brand-navy mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-500">Everything you need to know about the Khalsa College Connect platform.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-bold text-brand-navy pr-4">{faq.question}</span>
                    <ChevronDown size={18} className="text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 bg-brand-navy rounded-[2.5rem] p-10 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">Can't find the answer you're looking for? Our community is here to help.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/community/chat" className="btn-primary">
                  Ask in Community
                </Link>
                <Link to="/" className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-colors">
                  Contact Help Desk
                </Link>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}
