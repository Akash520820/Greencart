import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleContinueShopping = () => {
    navigate('/AllProduct');
  };

  const handleCheckout = () => {
    // You can implement checkout logic here
    alert('Checkout functionality will be implemented');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2 className="empty-cart-title">Your Cart is Empty</h2>
            <p className="empty-cart-text">Looks like you haven't added anything to your cart yet</p>
            <button className="empty-cart-btn" onClick={handleContinueShopping}>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="cart-content">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image-wrapper">
                  <img src={item.image[0]} alt={item.name} className="cart-item-image" />
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                  
                  <div className="cart-item-price">
                    {item.offerPrice ? (
                      <>
                        <span className="cart-item-price-current">₹{item.offerPrice}</span>
                        <span className="cart-item-price-original">₹{item.price}</span>
                        <span className="cart-item-discount">
                          {Math.round(((item.price - item.offerPrice) / item.price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="cart-item-price-current">₹{item.price}</span>
                    )}
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>

                  <div className="cart-item-subtotal">
                    ₹{(item.offerPrice || item.price) * item.quantity}
                  </div>

                  <button 
                    className="cart-item-remove"
                    onClick={() => handleRemoveItem(item._id)}
                    aria-label="Remove item"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary Section */}
          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>
              
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{getTotalPrice()}</span>
              </div>
              
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className="cart-summary-free">FREE</span>
              </div>
              
              <div className="cart-summary-divider"></div>
              
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>₹{getTotalPrice()}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                Continue Shopping
              </button>

              <div className="cart-summary-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;