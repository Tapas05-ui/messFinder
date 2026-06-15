import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Mess<span className="text-primary-400">Finder</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">Find the perfect mess near your college. Compare prices, facilities, and book easily.</p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/mess', 'Find Mess'], ['/register', 'Register']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-primary-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div id="services">
          <h4 className="font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Mess Listing</li>
            <li>Room Booking</li>
            <li>Facility Comparison</li>
            <li>Owner Registration</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-400" /><span>support@messfinder.com</span></li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-400" /><span>+91 98765 43210</span></li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-400" /><span>India</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MessFinder. All rights reserved.
      </div>
    </footer>
  );
}
