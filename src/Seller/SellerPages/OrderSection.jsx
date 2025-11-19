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
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-section-page">
      <Toaster position="top-center" />
      
      <div className="orders-header">
        <div>
          <h1 className="orders-title">Orders List</h1>
          <p className="orders-subtitle">
            Manage and track all customer orders ({orders.length} total)
          </p>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Product Info */}
              <div className="order-product-info">
                {order.items.length === 1 ? (
                  // Single product order
                  <div className="product-details">
                    <img 
                      src={order.items[0].product.image[0] || order.items[0].product.image} 
                      alt={order.items[0].product.name}
                      className="order-product-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                      }}
                    />
                    <div>
                      <h3 className="order-product-name">
                        {order.items[0].product.name}
                        <span className="quantity"> x {order.items[0].quantity}</span>
                      </h3>
                    </div>
                  </div>
                ) : (
                  // Multiple products order
                  <div className="product-details">
                    <div className="multiple-products-icon">
                      <i className="bi bi-cart-fill"></i>
                    </div>
                    <div>
                      {order.items.slice(0, 3).map((item, index) => (
                        <p key={index} className="multi-product-item">
                          {item.product.name}
                          <span className="quantity"> x {item.quantity}</span>
                        </p>
                      ))}
                      {order.items.length > 3 && (
                        <p className="multi-product-item">
                          <em>+{order.items.length - 3} more items</em>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="order-customer-info">
                <h4 className="customer-name">{order.userName}</h4>
                <p className="customer-address">{order.address.fullAddress}</p>
                <p className="customer-address" style={{ marginTop: '0.5rem' }}>
                  <i className="bi bi-envelope me-2"></i>
                  {order.userEmail}
                </p>
              </div>

              {/* Price Info */}
              <div className="order-price-info">
                <div className="price-amount">${order.total.toFixed(2)}</div>
              </div>

              {/* Meta Info & Actions */}
              <div className="order-meta-info">
                <div className="meta-item">
                  <span className="meta-label">Order ID:</span>
                  <span className="meta-value">{order.orderId}</span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Payment:</span>
                  <span className="meta-value">{order.paymentMethod.toUpperCase()}</span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Date:</span>
                  <span className="meta-value">{formatDate(order.orderDate)}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="meta-item">
                  <span className="meta-label">Payment Status:</span>
                  <span className={`payment-status ${order.paymentStatus.toLowerCase()}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders">
            <i className="bi bi-inbox"></i>
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSection;