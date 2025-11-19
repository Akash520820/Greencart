// OrderContext.jsx - FIXED VERSION
import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 Keep loading state

  // 👈 FIXED: Better initialization
  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('allOrders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          setOrders(parsedOrders);
          console.log('Orders loaded from localStorage:', parsedOrders.length); // Debug log
        } else {
          console.log('No orders found in localStorage'); // Debug log
          setOrders([]);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // 👈 FIXED: Save to localStorage immediately after state update
  useEffect(() => {
    if (!loading) { // Only save after initial load
      try {
        localStorage.setItem('allOrders', JSON.stringify(orders));
        console.log('Orders saved to localStorage:', orders.length); // Debug log
      } catch (error) {
        console.error('Error saving orders:', error);
      }
    }
  }, [orders, loading]);

  // Client: Create new order
  const createOrder = (orderData) => {
    const newOrder = {
      _id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: `ORD${Date.now()}`,
      userId: orderData.userId,
      userName: orderData.userName,
      userEmail: orderData.userEmail,
      items: orderData.items,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      paymentDetails: orderData.paymentDetails,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      platformFee: orderData.platformFee || 5,
      handlingFee: orderData.handlingFee || 0,
      shipping: orderData.shipping || 0,
      total: orderData.total,
      status: 'Pending',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'Pending' : 'Paid',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prevOrders => {
      const updatedOrders = [newOrder, ...prevOrders];
      // Trigger event for real-time updates
      window.dispatchEvent(new Event('ordersUpdated'));
      return updatedOrders;
    });

    return newOrder;
  };

  // Seller: Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order._id === orderId
          ? { 
              ...order, 
              status: newStatus,
              updatedAt: new Date().toISOString()
            }
          : order
      );
      window.dispatchEvent(new Event('ordersUpdated'));
      return updatedOrders;
    });
  };

  // Seller: Update payment status
  const updatePaymentStatus = (orderId, paymentStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order._id === orderId
          ? { 
              ...order, 
              paymentStatus,
              updatedAt: new Date().toISOString()
            }
          : order
      );
      window.dispatchEvent(new Event('ordersUpdated'));
      return updatedOrders;
    });
  };

  // Client: Get user's orders
  const getUserOrders = (userEmail) => {
    return orders
      .filter(order => order.userEmail === userEmail)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  // Seller: Get all orders (for seller dashboard)
  const getAllOrders = () => {
    return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  // Seller: Get orders by status
  const getOrdersByStatus = (status) => {
    if (status === 'All') return getAllOrders();
    return orders
      .filter(order => order.status === status)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  // Seller: Get order statistics
  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;
    const totalRevenue = orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue
    };
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order._id === orderId || order.orderId === orderId);
  };

  // Listen for storage changes (sync across tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only reload if allOrders changed
      if (e.key === 'allOrders' || e.type === 'ordersUpdated') {
        const savedOrders = localStorage.getItem('allOrders');
        if (savedOrders) {
          try {
            const parsedOrders = JSON.parse(savedOrders);
            setOrders(parsedOrders);
            console.log('Orders reloaded from storage event'); // Debug log
          } catch (error) {
            console.error('Error parsing orders from storage event:', error);
          }
        }
      }
    };

    window.addEventListener('ordersUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('ordersUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    getUserOrders,
    getAllOrders,
    getOrdersByStatus,
    getOrderStats,
    getOrderById
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

export default OrderContext;