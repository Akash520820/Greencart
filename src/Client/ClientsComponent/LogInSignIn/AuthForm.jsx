import React, { useState, useCallback } from 'react';
import FormInput from './FormInput';
import AuthToggleText from './AuthToggleText';
import { useClientAuth } from '../../../context/ClientAuthContext';

const AuthForm = ({ isLogin, onToggleMode, onClose, onAuthSuccess, hasPendingProduct }) => {
  const { login } = useClientAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Simulate successful login/signup
    const userData = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
    };
    
    // Login user
    login(userData);
    
    // Reset form
    setFormData({ name: '', email: '', password: '' });
    
    // Call success handler which will handle product addition and redirect
    if (onAuthSuccess) {
      onAuthSuccess();
    } else {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {hasPendingProduct && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#e7f5ec',
          borderRadius: '8px',
          border: '1px solid #4CAF50',
          fontSize: '0.85rem',
          color: '#2E7D32',
          textAlign: 'center'
        }}>
          ✓ Login to add this product to your cart
        </div>
      )}

      {!isLogin && (
        <FormInput
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="type here"
        />
      )}

      <FormInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="type here"
      />

      <FormInput
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="type here"
      />

      <AuthToggleText 
        isLogin={isLogin}
        onToggle={onToggleMode}
      />

      <button type="submit" className="auth-form-submit-btn">
        {isLogin ? 'Login' : 'Create Account'}
      </button>
    </form>
  );
};

export default React.memo(AuthForm);