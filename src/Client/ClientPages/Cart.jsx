// Cart.jsx - Updated to use Payment Modal
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useClientAuth } from '../../context/ClientAuthContext';
import CartItem from '../ClientsComponent/Cart/CartItem';
import EmptyCart from '../ClientsComponent/Cart/EmptyCart';
import CartLoading from '../ClientsComponent/Cart/CartLoading';
import PaymentModal from '../ClientsComponent/Cart/PaymentModal';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useClientAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  // Load addresses on mount
  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`addresses_${user.email}`);
      if (saved) {
        const parsedAddresses = JSON.parse(saved);
        setAddresses(parsedAddresses);
        if (parsedAddresses.length > 0 && !selectedAddress) {
          setSelectedAddress(parsedAddresses[0]);
        }
      }
    }
  }, [user, selectedAddress]);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

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

  const handleClearCart = useCallback(() => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontWeight: '600', color: '#2d3748' }}>
          Are you sure you want to clear your cart?
        </span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '8px 16px',
              background: '#e2e8f0',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              clearCart();
              toast.dismiss(t.id);
              toast.success('Cart cleared successfully', {
                duration: 2000,
                position: 'top-center',
              });
            }}
            style={{
              padding: '8px 16px',
              background: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        background: '#fff',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    });
  }, [clearCart]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const addressWithId = {
      ...newAddress,
      id: Date.now().toString()
    };
    
    const updatedAddresses = [...addresses, addressWithId];
    setAddresses(updatedAddresses);
    localStorage.setItem(`addresses_${user?.email}`, JSON.stringify(updatedAddresses));
    
    setSelectedAddress(addressWithId);
    setShowAddressModal(false);
    setNewAddress({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: ''
    });

    toast.success('Address added successfully!', {
      duration: 2000,
      position: 'top-center',
    });
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error('Please add a delivery address first', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fff',
          color: '#2d3748',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
        },
        iconTheme: {
          primary: '#e53e3e',
          secondary: '#fff',
        },
      });
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (paymentDetails) => {
    const subtotal = getTotalPrice();
    const platformFee = 5;
    const handlingFee = paymentDetails.method === 'cod' ? 9 : 0;
    const tax = subtotal * 0.02;
    const total = subtotal + platformFee + handlingFee + tax;

    const order = {
      orderId: `ORD${Date.now()}`,
      userId: user?.email,
      userName: user?.name || user?.email,
      items: cartItems.map(item => ({
        ...item,
        priceAtOrder: item.offerPrice || item.price
      })),
      address: selectedAddress,
      paymentMethod: paymentDetails.method,
      paymentDetails: paymentDetails.details,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      platformFee,
      handlingFee,
      shipping: 0,
      total: parseFloat(total.toFixed(2)),
      status: 'Pending',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Save order
    const existingOrders = JSON.parse(localStorage.getItem(`orders_${user?.email}`) || '[]');
    existingOrders.unshift(order);
    localStorage.setItem(`orders_${user?.email}`, JSON.stringify(existingOrders));

    // Clear cart
    clearCart();
    setShowPaymentModal(false);

    // Success toast
    toast.success('Order placed successfully! 🎉', {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#2d3748',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
      },
      iconTheme: {
        primary: '#4CAF50',
        secondary: '#fff',
      },
    });

    setTimeout(() => {
      navigate('/my-orders');
    }, 1000);
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.02;
  const total = subtotal + tax;

  if (!isAuthenticated) {
    return (
      <CartLoading 
        showModal={showAuthModal}
        onCloseModal={handleCloseModal}
        redirectTo="/cart"
      />
    );
  }

  if (cartItems.length === 0) {
    return <EmptyCart onStartShopping={handleContinueShopping} />;
  }

  return (
    <div className="cart-page">
      <Toaster />
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="cart-content">
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

          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>
              
              {/* Delivery Address */}
              <div className="checkout-section">
                <div className="checkout-section-header">
                  <h3>DELIVERY ADDRESS</h3>
                  {selectedAddress && (
                    <button 
                      className="change-link"
                      onClick={() => setShowAddressModal(true)}
                    >
                      Change
                    </button>
                  )}
                </div>
                
                {selectedAddress ? (
                  <div className="selected-address">
                    <p className="address-name">{selectedAddress.fullName}</p>
                    <p className="address-text">
                      {selectedAddress.addressLine1}
                      {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                    </p>
                    <p className="address-text">
                      {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                    <p className="address-phone">Phone: {selectedAddress.phone}</p>
                  </div>
                ) : (
                  <div className="no-address">
                    <p>No address found</p>
                    <button 
                      className="add-address-btn"
                      onClick={() => setShowAddressModal(true)}
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="cart-summary-row">
                <span>Shipping Fee</span>
                <span className="cart-summary-free">FREE</span>
              </div>
              
              <div className="cart-summary-row">
                <span>Tax (2%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="cart-summary-divider"></div>
              
              <div className="cart-summary-row cart-summary-total">
                <span>Total Amount:</span>
                <span>₹{total.toFixed(2)}</span>
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

        {/* Address Modal */}
        {showAddressModal && (
          <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
            <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Delivery Address</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowAddressModal(false)}
                >
                  ×
                </button>
              </div>

              {addresses.length > 0 && (
                <div className="saved-addresses">
                  <h3>Saved Addresses</h3>
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      className={`saved-address-item ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddressModal(false);
                      }}
                    >
                      <div className="address-radio">
                        {selectedAddress?.id === addr.id && <div className="radio-dot"></div>}
                      </div>
                      <div className="address-info">
                        <p className="addr-name">{addr.fullName}</p>
                        <p className="addr-text">
                          {addr.addressLine1}, {addr.addressLine2}
                        </p>
                        <p className="addr-text">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="addr-phone">Phone: {addr.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="add-new-address">
                <h3>Add New Address</h3>
                <form onSubmit={handleAddressSubmit} className="address-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                    />
                  </div>

                  <div className="form-group">
                    <label>Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                      placeholder="House No., Building Name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input
                      type="text"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
                      placeholder="Road Name, Area, Colony"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="City"
                      />
                    </div>

                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                      placeholder="6-digit pincode"
                      pattern="[0-9]{6}"
                    />
                  </div>

                  <button type="submit" className="submit-address-btn">
                    Save & Use This Address
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          show={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderTotal={subtotal}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </div>
  );
};

export default Cart;