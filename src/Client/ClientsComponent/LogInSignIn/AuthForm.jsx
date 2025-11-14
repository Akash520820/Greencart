import React, { useState, useCallback } from 'react';
import FormInput from './FormInput';
import AuthToggleText from './AuthToggleText';
import { useClientAuth } from '../../../context/ClientAuthContext';  // ← FIXED

const AuthForm = ({ isLogin, onToggleMode, onClose }) => {
  const { login } = useClientAuth();  // ← FIXED
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
    
    login(userData);
    onClose();
    
    // Reset form
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
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