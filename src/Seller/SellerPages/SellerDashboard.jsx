import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { seller } = useSellerAuth();
  const { products, getSellerStats } = useProducts();
  const { getAllOrders, getOrderStats } = useOrders();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    outOfStock: 0,
    inStock: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Listen for updates
  useEffect(() => {
    const handleUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener('ordersUpdated', handleUpdate);
    window.addEventListener('productsUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('ordersUpdated', handleUpdate);
      window.removeEventListener('productsUpdated', handleUpdate);
    };
  }, []);

  const loadDashboardData = () => {
    setLoading(true);
    
    try {
      // Get product stats
      const productStats = getSellerStats();
      
      // Get order stats
      const orderStats = getOrderStats();
      
      // Get recent orders (last 5)
      const allOrders = getAllOrders();
      const recent = allOrders.slice(0, 5).map(order => ({
        _id: order._id,
        customerName: order.userName,
        productName: order.items.length === 1 
          ? order.items[0].product.name 
          : `${order.items.length} items`,
        amount: order.total,
        status: order.status,
        date: new Date(order.orderDate).toLocaleDateString('en-GB')
      }));
      
      setStats({
        totalProducts: productStats.totalProducts,
        inStock: productStats.inStock,
        outOfStock: productStats.outOfStock,
        totalOrders: orderStats.totalOrders,
        pendingOrders: orderStats.pendingOrders,
        totalRevenue: orderStats.totalRevenue
      });
      
      setRecentOrders(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {seller?.name || 'Seller'}! 👋
          </h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your store today
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">
            <i className="bi bi-box-seam"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalProducts}</h3>
            <p className="stat-label">Total Products</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/seller/inventory')}
          >
            View All <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">
            <i className="bi bi-cart-check"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalOrders}</h3>
            <p className="stat-label">Total Orders</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/seller/orders')}
          >
            View All <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">
            <i className="bi bi-clock-history"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.pendingOrders}</h3>
            <p className="stat-label">Pending Orders</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/seller/orders')}
          >
            View All <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">${stats.totalRevenue.toLocaleString()}</h3>
            <p className="stat-label">Total Revenue</p>
          </div>
          <div className="stat-trend">
            <i className="bi bi-graph-up-arrow"></i>
            <span>From {stats.totalOrders} orders</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button 
            className="quick-action-card"
            onClick={() => navigate('/seller/add-product')}
          >
            <div className="quick-action-icon">
              <i className="bi bi-plus-circle"></i>
            </div>
            <h3 className="quick-action-title">Add Product</h3>
            <p className="quick-action-desc">Add new products to your inventory</p>
          </button>

          <button 
            className="quick-action-card"
            onClick={() => navigate('/seller/inventory')}
          >
            <div className="quick-action-icon">
              <i className="bi bi-clipboard-data"></i>
            </div>
            <h3 className="quick-action-title">Manage Inventory</h3>
            <p className="quick-action-desc">Update stock and product details</p>
          </button>

          <button 
            className="quick-action-card"
            onClick={() => navigate('/seller/orders')}
          >
            <div className="quick-action-icon">
              <i className="bi bi-box-seam"></i>
            </div>
            <h3 className="quick-action-title">View Orders</h3>
            <p className="quick-action-desc">Process and manage customer orders</p>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="recent-orders-section">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/seller/orders')}
            >
              View All <i className="bi bi-arrow-right"></i>
            </button>
          </div>

          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td className="customer-cell">{order.customerName}</td>
                    <td className="product-cell">{order.productName}</td>
                    <td className="amount-cell">${order.amount.toFixed(2)}</td>
                    <td className="status-cell">
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="date-cell">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alert if products are out of stock */}
      {stats.outOfStock > 0 && (
        <div className="alert-banner">
          <i className="bi bi-exclamation-triangle"></i>
          <span>
            {stats.outOfStock} product{stats.outOfStock > 1 ? 's are' : ' is'} out of stock.
          </span>
          <button 
            className="alert-action"
            onClick={() => navigate('/seller/inventory')}
          >
            Update Stock
          </button>
        </div>
      )}

      {/* No orders message */}
      {recentOrders.length === 0 && (
        <div className="alert-banner" style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', borderColor: '#2196F3' }}>
          <i className="bi bi-info-circle" style={{ color: '#1976d2' }}></i>
          <span style={{ color: '#0d47a1' }}>
            No orders yet. Start by adding products to your inventory!
          </span>
          <button 
            className="alert-action"
            style={{ background: '#2196F3' }}
            onClick={() => navigate('/seller/add-product')}
          >
            Add Products
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;