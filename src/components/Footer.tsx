export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <a href="/" className="text-2xl font-bold text-brand-navy tracking-tight">
            KhalsaCollege Connect
          </a>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-brand-navy transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-navy transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-navy transition-colors">Faculty Portal</a>
            <a href="#" className="hover:text-brand-navy transition-colors">Contact Support</a>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2024 KhalsaCollege Connect. Academic Excellence through Collaboration.</p>
          <div className="flex gap-4 italic">
            Made for Students, by Students.
          </div>
        </div>
      </div>
    </footer>
  );
}
