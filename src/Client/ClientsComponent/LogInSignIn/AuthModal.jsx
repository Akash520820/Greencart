import React, { useState } from 'react';
import AuthModalBackdrop from './AuthModalBackdrop';
import AuthModalContent from './AuthModalContent';
import './AuthModal.css';

const AuthModal = ({ show, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  if (!show) return null;

  return (
    <>
      <AuthModalBackdrop onClick={onClose} />
      <AuthModalContent 
        isLogin={isLogin}
        onClose={onClose}
        onToggleMode={toggleMode}
      />
    </>
  );
};

export default AuthModal;