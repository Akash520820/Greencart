// Cart.jsx - FIXED (Prevents duplicate order creation)
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { useClientAuth } from '../../context/ClientAuthContext';
import { useOrders } from '../../context/OrderContext';

import CartHeader from '../ClientsComponent/Cart/CartHeader';
import CartItemsList from '../ClientsComponent/Cart/CartItemsList';
import EmptyCart from '../ClientsComponent/Cart/EmptyCart';
import CartLoading from '../ClientsComponent/Cart/CartLoading';
import AddressSection from '../ClientsComponent/Cart/AddressSection';
import PriceBreakdown from '../ClientsComponent/Cart/PriceBreakdown';
import AddressModal from '../ClientsComponent/Cart/AddressModal';
import PaymentModal from '../ClientsComponent/Cart/PaymentModal';

import './Cart.css';
import '../ClientsComponent/Cart/AddressModal.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useClientAuth();
  const { createOrder } = useOrders();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false); // 👈 Prevent double submission
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
  }, [user?.email]);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  // Memoized price calculations
  const priceData = useMemo(() => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.02;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [getTotalPrice]);

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

  const handleAddressSelect = useCallback((addr) => {
    setSelectedAddress(addr);
    setShowAddressModal(false);
  }, []);

  const handleAddressSubmit = useCallback((e) => {
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
  }, [newAddress, addresses, user?.email]);

  const handleCheckout = useCallback(() => {
    if (!selectedAddress) {
      toast.error('Please add a delivery address first', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }
    setShowPaymentModal(true);
  }, [selectedAddress]);

  // 👇 FIXED: Prevent duplicate order creation
  const handlePaymentComplete = useCallback((paymentDetails) => {
    // Prevent double submission
    if (isProcessingOrder) {
      console.log('Order already being processed, skipping...');
      return;
    }
    
    setIsProcessingOrder(true); // 👈 Lock to prevent duplicate
    
    try {
      const subtotal = getTotalPrice();
      const platformFee = 5;
      const handlingFee = paymentDetails.method === 'cod' ? 9 : 0;
      const tax = subtotal * 0.02;
      const total = subtotal + platformFee + handlingFee + tax;

      const orderData = {
        userId: user?.email,
        userName: user?.name || user?.email,
        userEmail: user?.email,
        items: cartItems.map(item => ({
          product: item,
          quantity: item.quantity,
          priceAtOrder: item.offerPrice || item.price
        })),
        address: {
          ...selectedAddress,
          fullAddress: `${selectedAddress.addressLine1}, ${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`
        },
        paymentMethod: paymentDetails.method,
        paymentDetails: paymentDetails.details,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        platformFee,
        handlingFee,
        shipping: 0,
        total: parseFloat(total.toFixed(2))
      };

      // Create order using context (only once!)
      const createdOrder = createOrder(orderData);
      console.log('Order created successfully:', createdOrder.orderId);

      // Clear cart
      clearCart();
      setShowPaymentModal(false);

      // Success toast
      toast.success('Order placed successfully! 🎉', {
        duration: 4000,
        position: 'top-center',
      });

      setTimeout(() => {
        navigate('/my-orders');
      }, 1000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
      setIsProcessingOrder(false); // Reset on error
    }
  }, [cartItems, selectedAddress, user, getTotalPrice, clearCart, navigate, createOrder, isProcessingOrder]);

  // Reset processing state when modal closes
  useEffect(() => {
    if (!showPaymentModal) {
      setIsProcessingOrder(false);
    }
  }, [showPaymentModal]);

  // Early returns
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
        <CartHeader itemCount={cartItems.length} />

        <div className="cart-content">
          <CartItemsList
            items={cartItems}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
            onClearCart={handleClearCart}
          />

          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>
              
              <AddressSection
                selectedAddress={selectedAddress}
                onChangeAddress={() => setShowAddressModal(true)}
              />

              <PriceBreakdown
                subtotal={priceData.subtotal}
                tax={priceData.tax}
                total={priceData.total}
              />

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

        <AddressModal
          show={showAddressModal}
          addresses={addresses}
          selectedAddress={selectedAddress}
          newAddress={newAddress}
          onClose={() => setShowAddressModal(false)}
          onAddressSelect={handleAddressSelect}
          onAddressChange={setNewAddress}
          onSubmit={handleAddressSubmit}
        />

        <PaymentModal
          show={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderTotal={priceData.subtotal}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </div>
  );
};

export default Cart;