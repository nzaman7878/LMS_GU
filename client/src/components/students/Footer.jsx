
import { assets } from '../../assets/assets.js'
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full mt-16">

      
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12
                      grid grid-cols-1 md:grid-cols-3 gap-10
                      border-b border-white/20">

        
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
  <Link 
    to="/admin-login" 
    className="hover:text-white transition"
  >
    Admin Login
  </Link>
</li>
    <li><a className="hover:text-white transition" href="#">Home</a></li>
    <li><a className="hover:text-white transition" href="#">About Gauhati University</a></li>
    <li><a className="hover:text-white transition" href="#">Courses</a></li>
    <li><a className="hover:text-white transition" href="#">Contact</a></li>
  </ul>
</div>

       
        <div className="flex flex-col items-center md:items-start text-center md:text-left">

          <h2 className="font-semibold mb-4">Stay Updated</h2>

          <p className="text-sm text-white/70 mb-4 max-w-xs">
            Receive updates about courses, university announcements,
            and learning resources directly in your inbox.
          </p>

          <div className="flex w-full max-w-xs">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-800 border border-gray-700
                         text-sm px-3 py-2 rounded-l outline-none
                         placeholder-gray-500"
            />

            <button
              className="bg-blue-600 hover:bg-blue-700
                         px-4 py-2 text-sm rounded-r transition">
              Subscribe
            </button>
          </div>

        </div>

      </div>

      
      <p className="text-center text-xs md:text-sm text-white/60 py-5">
        © 2026 Gauhati University LMS. All Rights Reserved.
      </p>

    </footer>
  )
}

export default Footer