// MyOrders.jsx - FIXED with proper loading
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useClientAuth } from '../../context/ClientAuthContext';
import { useOrders } from '../../context/OrderContext';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useClientAuth();
  const { getUserOrders, updateOrderStatus, loading: ordersLoading } = useOrders(); // 👈 Get loading state
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true); // 👈 Local loading state

  // 👈 FIXED: Wait for auth and orders to load
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Wait for orders context to finish loading
    if (!ordersLoading && user?.email) {
      loadOrders();
      setIsLoading(false);
    }
  }, [user, isAuthenticated, ordersLoading, navigate]);

  // Listen for order updates
  useEffect(() => {
    const handleOrdersUpdate = () => {
      if (user?.email && !ordersLoading) {
        loadOrders();
      }
    };

    window.addEventListener('ordersUpdated', handleOrdersUpdate);
    
    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdate);
    };
  }, [user?.email, ordersLoading]);

  const loadOrders = () => {
    if (user?.email) {
      const userOrders = getUserOrders(user.email);
      setOrders(userOrders);
      console.log('Loaded user orders:', userOrders.length); // Debug log
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#FF9800',
      'Processing': '#2196F3',
      'Shipped': '#9C27B0',
      'Delivered': '#4CAF50',
      'Cancelled': '#F44336'
    };
    return colors[status] || '#757575';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleProductClick = (productId, e) => {
    if (e) e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  const handleCancelOrder = (orderId) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontWeight: '600', color: '#2d3748' }}>
          Are you sure you want to cancel this order?
        </span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            style={{
              padding: '8px 16px',
              background: '#e2e8f0',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            No, Keep It
          </button>
          <button
            onClick={() => {
              updateOrderStatus(orderId, 'Cancelled');
              loadOrders();
              toast.dismiss(t.id);
              toast.success('Order cancelled successfully', {
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
                  primary: '#4CAF50',
                  secondary: '#fff',
                },
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
            Yes, Cancel
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
  };

  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // 👈 Show loading state
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="my-orders-page">
        <div className="container">
          <div className="orders-loading">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <Toaster />
      <div className="container">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>

        <div className="orders-filters">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="1.5">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <h2>No {filterStatus !== 'All' ? filterStatus : ''} Orders Found</h2>
            <p>You haven't placed any orders yet</p>
            <button className="start-shopping-btn" onClick={() => navigate('/AllProduct')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-header-left">
                    <h3 className="order-id">Order #{order.orderId}</h3>
                    <span 
                      className="order-status"
                      style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="order-header-right">
                    <p className="order-date">
                      Placed on: {formatDate(order.orderDate)}
                    </p>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div 
                        key={index} 
                        className="order-item-mini"
                        onClick={() => handleProductClick(item.product._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={item.product.image[0] || item.product.image} alt={item.product.name} />
                        <div className="item-mini-details">
                          <p className="item-mini-name">{item.product.name}</p>
                          <p className="item-mini-qty">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>

                  <div className="order-info-grid">
                    <div className="order-info-item">
                      <span className="info-label">Total Amount</span>
                      <span className="info-value">₹{order.total.toFixed(2)}</span>
                    </div>
                    <div className="order-info-item">
                      <span className="info-label">Payment Method</span>
                      <span className="info-value">{order.paymentMethod}</span>
                    </div>
                    <div className="order-info-item">
                      <span className="info-label">Delivery Expected</span>
                      <span className="info-value">{formatDate(order.estimatedDelivery)}</span>
                    </div>
                    <div className="order-info-item">
                      <span className="info-label">Items</span>
                      <span className="info-value">{order.items.length}</span>
                    </div>
                  </div>
                </div>

                <div className="order-card-footer">
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </button>
                  {order.status === 'Pending' && (
                    <button 
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Order Details</h2>
                <button 
                  className="modal-close-btn"
                  onClick={() => setShowDetailsModal(false)}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="details-section">
                  <div className="section-title-row">
                    <h3>Order Information</h3>
                    <span 
                      className="order-status-badge"
                      style={{ backgroundColor: `${getStatusColor(selectedOrder.status)}20`, color: getStatusColor(selectedOrder.status) }}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Order ID:</span>
                      <span className="detail-value">{selectedOrder.orderId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Order Date:</span>
                      <span className="detail-value">{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Expected Delivery:</span>
                      <span className="detail-value">{formatDate(selectedOrder.estimatedDelivery)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Payment Method:</span>
                      <span className="detail-value">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Delivery Address</h3>
                  <div className="address-box">
                    <p className="address-name">{selectedOrder.address.fullName}</p>
                    <p className="address-text">
                      {selectedOrder.address.fullAddress || `${selectedOrder.address.addressLine1}${selectedOrder.address.addressLine2 ? ', ' + selectedOrder.address.addressLine2 : ''}, ${selectedOrder.address.city}, ${selectedOrder.address.state} - ${selectedOrder.address.pincode}`}
                    </p>
                    <p className="address-phone">Phone: {selectedOrder.address.phone}</p>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Items ({selectedOrder.items.length})</h3>
                  <div className="order-items-list">
                    {selectedOrder.items.map((item, index) => (
                      <div 
                        key={index} 
                        className="order-detail-item"
                        onClick={(e) => handleProductClick(item.product._id, e)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={item.product.image[0] || item.product.image} alt={item.product.name} className="item-image" />
                        <div className="item-details">
                          <h4>{item.product.name}</h4>
                          <p className="item-category">{item.product.category}</p>
                          <p className="item-quantity">Quantity: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          ₹{(item.priceAtOrder * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="details-section">
                  <h3>Payment Summary</h3>
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                      <span>Shipping</span>
                      <span className="free-text">FREE</span>
                    </div>
                    <div className="price-row">
                      <span>Tax (2%)</span>
                      <span>₹{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="price-divider"></div>
                    <div className="price-row total-row">
                      <span>Total Amount</span>
                      <span>₹{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;