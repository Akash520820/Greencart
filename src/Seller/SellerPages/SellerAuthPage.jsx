import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import './SellerAuthPage.css';

const SellerAuthPage = () => {
  const navigate = useNavigate();
  const { sellerLogin, sellerSignup } = useSellerAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await sellerLogin(formData.email, formData.password);
      } else {
        result = await sellerSignup(
          formData.name,
          formData.email,
          formData.password,
          formData.shopName,
          formData.phone
        );
      }

      if (result.success) {
        navigate('/seller/dashboard');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      shopName: '',
      phone: ''
    });
  };

  return (
    <div className="seller-auth-page">
      <div className="seller-auth-container">
        <div className="seller-auth-content">
          {/* Header */}
          <div className="seller-auth-header">
            <h3 className="seller-auth-title">
              <span className="text-success">Seller</span>{' '}
              {isLogin ? 'Login' : 'Sign Up'}
            </h3>
            <button 
              className="seller-auth-back-btn" 
              onClick={() => navigate('/')}
              title="Back to Home"
            >
              ×
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="seller-auth-error">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="auth-form-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="auth-form-input"
                  required
                />
              </div>
            )}

            <div className="auth-form-input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="auth-form-input"
                required
              />
            </div>

            <div className="auth-form-input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="auth-form-input"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="auth-form-input-group">
                  <label>Shop Name</label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="Enter your shop name"
                    className="auth-form-input"
                    required
                  />
                </div>

                <div className="auth-form-input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="auth-form-input"
                    required
                  />
                </div>
              </>
            )}

            {/* Toggle Text */}
            <div className="auth-form-toggle-text">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    className="auth-form-toggle-link" 
                    onClick={toggleMode}
                  >
                    Sign up here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    className="auth-form-toggle-link" 
                    onClick={toggleMode}
                  >
                    Login here
                  </button>
                </>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="auth-form-submit-btn"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerAuthPage;