// create a simple navbar with Home, About, Contact links
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li><a href="/" className="text-white hover:text-gray-300">Home</a></li>
        <li><a href="/about" className="text-white hover:text-gray-300">About</a></li>
        <li><a href="/contact" className="text-white hover:text-blue-300">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;