import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useClientAuth } from '../../context/ClientAuthContext';
import CartItem from '../ClientsComponent/Cart/CartItem';
import CartSummary from '../ClientsComponent/Cart/CartSummary';
import EmptyCart from '../ClientsComponent/Cart/EmptyCart';
import CartLoading from '../ClientsComponent/Cart/CartLoading';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useClientAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleCloseModal = useCallback(() => {
    setShowAuthModal(false);
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((productId) => {
    removeFromCart(productId);
  }, [removeFromCart]);

  const handleContinueShopping = useCallback(() => {
    navigate('/AllProduct');
  }, [navigate]);

  const handleCheckout = useCallback(() => {
    alert('Checkout functionality will be implemented');
  }, []);

  const handleClearCart = useCallback(() => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  }, [clearCart]);

  // Loading state - not authenticated
  if (!isAuthenticated) {
    return (
      <CartLoading 
        showModal={showAuthModal}
        onCloseModal={handleCloseModal}
        redirectTo="/cart"
      />
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return <EmptyCart onStartShopping={handleContinueShopping} />;
  }

  // Main cart with items
  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="cart-content">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}

            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary Section */}
          <CartSummary
            totalPrice={getTotalPrice()}
            onCheckout={handleCheckout}
            onContinueShopping={handleContinueShopping}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;