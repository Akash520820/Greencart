import React, { useState, useEffect } from 'react';
import { useOrders } from '../../context/OrderContext';
import toast, { Toaster } from 'react-hot-toast';
import './OrderSection.css';

const OrderSection = () => {
  const { getAllOrders, getOrdersByStatus, updateOrderStatus, updatePaymentStatus, loading } = useOrders();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  // Load orders on mount and when filter changes
  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  // Listen for order updates
  useEffect(() => {
    const handleOrdersUpdate = () => {
      loadOrders();
    };

    window.addEventListener('ordersUpdated', handleOrdersUpdate);
    
    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdate);
    };
  }, [statusFilter]);

  const loadOrders = () => {
    const fetchedOrders = statusFilter === 'All' 
      ? getAllOrders() 
      : getOrdersByStatus(statusFilter);
    setOrders(fetchedOrders);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast.success(`Order status updated to ${newStatus}`);
  };

  const handlePaymentStatusChange = (orderId, newPaymentStatus) => {
    updatePaymentStatus(orderId, newPaymentStatus);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="seller-loading-container">
        <div className="seller-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="seller-order-section-page">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="seller-orders-header">
        <h1 className="seller-orders-title">My Orders</h1>
        <p className="seller-orders-subtitle">{orders.length} orders placed</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="seller-status-filter-tabs">
        <button
          className={`seller-status-tab ${statusFilter === 'All' ? 'active' : ''}`}
          onClick={() => setStatusFilter('All')}
        >
          All
        </button>
        <button
          className={`seller-status-tab ${statusFilter === 'Pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Pending')}
        >
          Pending
        </button>
        <button
          className={`seller-status-tab ${statusFilter === 'Processing' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Processing')}
        >
          Processing
        </button>
        <button
          className={`seller-status-tab ${statusFilter === 'Shipped' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Shipped')}
        >
          Shipped
        </button>
        <button
          className={`seller-status-tab ${statusFilter === 'Delivered' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Delivered')}
        >
          Delivered
        </button>
        <button
          className={`seller-status-tab ${statusFilter === 'Cancelled' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Cancelled')}
        >
          Cancelled
        </button>
      </div>

      {/* Orders List */}
      <div className="seller-orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="seller-order-card">
              {/* Card Header */}
              <div className="seller-order-card-header">
                <div className="seller-order-id-section">
                  <h3 className="seller-order-id">Order #{order.orderId}</h3>
                  <span className={`seller-order-status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <p className="seller-order-date">Placed on: {formatDate(order.orderDate)}</p>
              </div>

              {/* Card Body */}
              <div className="seller-order-card-body">
                {/* Products List */}
                <div className="seller-order-products-list">
                  {order.items.length === 1 ? (
                    // Single product
                    <div className="seller-product-item">
                      <img 
                        src={order.items[0].product.image[0] || order.items[0].product.image} 
                        alt={order.items[0].product.name}
                        className="seller-product-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                        }}
                      />
                      <div className="seller-product-info">
                        <h4>{order.items[0].product.name}</h4>
                        <p className="seller-product-quantity">
                          Qty: <span className="quantity-value">{order.items[0].quantity}</span>
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Multiple products
                    order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="seller-product-item">
                        <img 
                          src={item.product.image[0] || item.product.image} 
                          alt={item.product.name}
                          className="seller-product-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                          }}
                        />
                        <div className="seller-product-info">
                          <h4>{item.product.name}</h4>
                          <p className="seller-product-quantity">
                            Qty: <span className="quantity-value">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {order.items.length > 2 && (
                    <div className="seller-product-item">
                      <div className="seller-multiple-products-icon">
                        <i className="bi bi-plus"></i>
                      </div>
                      <div className="seller-product-info">
                        <h4>+{order.items.length - 2} more items</h4>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Details Grid */}
                <div className="seller-order-details-grid">
                  <div className="seller-detail-item">
                    <span className="seller-detail-label">Total Amount</span>
                    <span className="seller-detail-value total-amount">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="seller-detail-item">
                    <span className="seller-detail-label">Payment Method</span>
                    <span className="seller-detail-value">
                      {order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="seller-detail-item">
                    <span className="seller-detail-label">Items</span>
                    <span className="seller-detail-value">{order.items.length}</span>
                  </div>

                  <div className="seller-detail-item">
                    <span className="seller-detail-label">Payment Status</span>
                    <span className="seller-detail-value">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="seller-customer-info-section">
                  <h4 className="seller-customer-name">{order.userName}</h4>
                  <p className="seller-customer-detail">
                    <i className="bi bi-geo-alt-fill"></i>
                    {order.address.fullAddress}
                  </p>
                  <p className="seller-customer-detail">
                    <i className="bi bi-envelope-fill"></i>
                    {order.userEmail}
                  </p>
                </div>

                {/* Status Update Section */}
                <div className="seller-status-update-section">
                  <span className="seller-status-update-label">Update Order Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="seller-status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Card Actions */}
              <div className="seller-order-card-actions">
                <button className="seller-action-btn view-details">
                  View Details
                </button>
                {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                  <button 
                    className="seller-action-btn cancel-order"
                    onClick={() => handleStatusChange(order._id, 'Cancelled')}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="seller-no-orders">
            <i className="bi bi-inbox"></i>
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSection;