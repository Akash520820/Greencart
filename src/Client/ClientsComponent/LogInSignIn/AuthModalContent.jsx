import React from 'react';
import AuthModalHeader from './AuthModalHeader';
import AuthForm from './AuthForm';

const AuthModalContent = ({ isLogin, onClose, onToggleMode }) => {
  return (
    <div className="auth-modal-container">
      <div className="auth-modal-content">
        <AuthModalHeader 
          isLogin={isLogin}
          onClose={onClose}
        />
        <AuthForm 
          isLogin={isLogin}
          onToggleMode={onToggleMode}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default React.memo(AuthModalContent);