import { assets } from '../../assets/assets.js';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-white/20">
      
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="bg-white p-2 rounded">
            <img
              src={assets.logo}
              alt="Gauhati University"
              className="h-10 w-auto"
            />
          </div>
          <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-sm">
            (GU-LMS) helps students access digital courses, academic resources, and
            structured learning materials to enhance knowledge and skills.
          </p>
        </div>

  
        <div className="flex flex-col items-center md:items-start">
          <h2 className="font-semibold mb-4 text-center md:text-left">
            University
          </h2>
          <ul className="space-y-2 text-sm text-white/70 text-center md:text-left">
            <li>
              <Link to="/admin-login" className="hover:text-white transition">
                Admin Login
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">
                About Gauhati University
              </Link>
            </li>
            <li>
              <Link to="/course-list" className="hover:text-white transition">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-semibold mb-4">Get In Touch</h2>
          <p className="text-sm text-white/70 mb-2">
            Have questions or need technical support? We are here to help.
          </p>
          <ul className="space-y-2 text-sm text-white/70 mt-2">
            <li>
              <span className="font-semibold text-white">Email:</span> support@gauhati.ac.in
            </li>
            <li>
              <span className="font-semibold text-white">Phone:</span> +91 123 456 7890
            </li>
            <li>
              <span className="font-semibold text-white">Location:</span> Guwahati, Assam, India
            </li>
          </ul>
        </div>
        
      </div>

      <p className="text-center text-xs md:text-sm text-white/60 py-5">
        © 2026 Gauhati University LMS. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;