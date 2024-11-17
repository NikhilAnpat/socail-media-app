import React, { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { RiAddCircleFill } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import { TbFriends } from 'react-icons/tb';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const getActiveState = () => {
    if (location.pathname === '/dashboard') return 'home';
    if (location.pathname === '/post') return 'add';
    if (location.pathname === '/friends') return 'friends';
    if (location.pathname === '/profile') return 'profile';
    return '';
  };

  const active = getActiveState();

  const handleNavigation = (path: string) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 100); // Simulate loading time
  };

  return (
    <div className="sticky bottom-0 left-0 flex justify-between items-center w-full p-4 bg-gray-200 h-[70px] shadow-lg">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
      <FaHome
        onClick={() => handleNavigation('/dashboard')}
        className={`text-4xl cursor-pointer transition-transform transform hover:scale-110 ${active === 'home' ? 'text-blue-500' : 'text-gray-600'}`}
      />
      <RiAddCircleFill
        onClick={() => handleNavigation('/post')}
        className={`text-4xl cursor-pointer transition-transform transform hover:scale-110 ${active === 'add' ? 'text-blue-500' : 'text-gray-600'}`}
      />
      <TbFriends
        onClick={() => handleNavigation('/friends')}
        className={`text-4xl cursor-pointer transition-transform transform hover:scale-110 ${active === 'friends' ? 'text-blue-500' : 'text-gray-600'}`}
      />
      <FaUserCircle
        onClick={() => handleNavigation('/profile')}
        className={`text-4xl cursor-pointer transition-transform transform hover:scale-110 ${active === 'profile' ? 'text-blue-500' : 'text-gray-600'}`}
      />
    </div>
  );
};

export default Footer;
