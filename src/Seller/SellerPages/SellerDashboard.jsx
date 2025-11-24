import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerAuth } from '../../context/SellerAuthContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { 
  FiPackage, 
  FiShoppingCart, 
  FiClock, 
  FiDollarSign,
  FiPlusCircle,
  FiClipboard,
  FiBox,
  FiArrowRight,
  FiAlertTriangle,
  FiInfo,
  FiTrendingUp
} from 'react-icons/fi';
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
      {/* Beautiful Welcome Card */}
      <div className="welcome-card">
        <div className="welcome-card-content">
          <h1 className="dashboard-title">
            Welcome back, {seller?.name || 'Seller'}!
            <span className="welcome-emoji">👋</span>
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
            <FiPackage />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalProducts}</h3>
            <p className="stat-label">Total Products</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/seller/inventory')}
          >
            View All <FiArrowRight />
          </button>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">
            <FiShoppingCart />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalOrders}</h3>
            <p className="stat-label">Total Orders</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/seller/orders')}
          >
            View All <FiArrowRight />
          </button>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">
            <FiClock />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.pendingOrders}</h3>
            <p className="stat-label">Pending Orders</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/seller/orders')}
          >
            View All <FiArrowRight />
          </button>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h3 className="stat-value">${stats.totalRevenue.toLocaleString()}</h3>
            <p className="stat-label">Total Revenue</p>
          </div>
          <div className="stat-trend">
            <FiTrendingUp />
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
              <FiPlusCircle />
            </div>
            <div>
              <h3 className="quick-action-title">Add Product</h3>
              <p className="quick-action-desc">Add new products to your inventory</p>
            </div>
          </button>

          <button 
            className="quick-action-card"
            onClick={() => navigate('/seller/inventory')}
          >
            <div className="quick-action-icon">
              <FiClipboard />
            </div>
            <div>
              <h3 className="quick-action-title">Manage Inventory</h3>
              <p className="quick-action-desc">Update stock and product details</p>
            </div>
          </button>

          <button 
            className="quick-action-card"
            onClick={() => navigate('/seller/orders')}
          >
            <div className="quick-action-icon">
              <FiBox />
            </div>
            <div>
              <h3 className="quick-action-title">View Orders</h3>
              <p className="quick-action-desc">Process and manage customer orders</p>
            </div>
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
              View All <FiArrowRight />
            </button>
          </div>

          {/* Desktop Table View */}
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

          {/* Mobile Card View */}
          <div className="mobile-orders-list">
            {recentOrders.map(order => (
              <div key={order._id} className="mobile-order-card">
                <div className="mobile-order-header">
                  <div>
                    <h3 className="mobile-order-customer">{order.customerName}</h3>
                    <p className="mobile-order-date">{order.date}</p>
                  </div>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mobile-order-body">
                  <div className="mobile-order-row">
                    <span className="mobile-order-label">Product</span>
                    <span className="mobile-order-value">{order.productName}</span>
                  </div>
                  <div className="mobile-order-row">
                    <span className="mobile-order-label">Amount</span>
                    <span className="mobile-order-amount">${order.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert if products are out of stock */}
      {stats.outOfStock > 0 && (
        <div className="alert-banner">
          <FiAlertTriangle />
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
          <FiInfo style={{ color: '#1976d2' }} />
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