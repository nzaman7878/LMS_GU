import React from 'react';
import { assets } from '../../assets/assets.js';

const Footer = () => {
  return (
    <footer className="w-full border-t bg-white px-6 md:px-10 py-4">

      <div className="flex md:flex-row flex-col items-center justify-between gap-4">

       
        <div className="flex items-center gap-4">
          <img
            className="w-12 hidden md:block"
            src={assets.logo}
            alt="Logo"
          />

          <div className="hidden md:block h-6 w-px bg-gray-400"></div>

          <p className="text-xs md:text-sm text-gray-500 text-center md:text-left">
            © 2026 LMS-GU. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hover:scale-110 transition">
            <img src={assets.facebook_icon} alt="facebook" className="w-5" />
          </a>

          <a href="#" className="hover:scale-110 transition">
            <img src={assets.twitter_icon} alt="twitter" className="w-5" />
          </a>

          <a href="#" className="hover:scale-110 transition">
            <img src={assets.instagram_icon} alt="instagram" className="w-5" />
          </a>
        </div>

      </div>

    </footer>
  );
};

export default Footer;