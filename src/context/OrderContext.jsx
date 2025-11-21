// OrderContext.jsx - FIXED VERSION (Orders show in Seller section)
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false); // Prevent double initialization

  // Initialize orders ONCE
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const loadOrders = () => {
      try {
        const savedOrders = localStorage.getItem('allOrders');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          setOrders(parsedOrders);
          console.log('Orders loaded from localStorage:', parsedOrders.length);
        } else {
          console.log('No orders found in localStorage');
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

  // Save to localStorage when orders change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('allOrders', JSON.stringify(orders));
      console.log('Orders saved:', orders.length);
    }
  }, [orders, loading]);

  // Create new order - FIXED with duplicate prevention
  const orderCreationLock = useRef(false);
  
  const createOrder = (orderData) => {
    // Prevent duplicate order creation
    if (orderCreationLock.current) {
      console.log('Order creation already in progress, skipping duplicate...');
      return null;
    }
    orderCreationLock.current = true;
    
    // Reset lock after 2 seconds
    setTimeout(() => {
      orderCreationLock.current = false;
    }, 2000);
    
    const newOrder = {
      _id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: `ORD${Date.now()}`,
      userId: orderData.userId,
      userName: orderData.userName,
      userEmail: orderData.userEmail,
      items: orderData.items,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      paymentDetails: orderData.paymentDetails || null,
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

    // Update state and localStorage immediately
    setOrders(prevOrders => {
      const updatedOrders = [newOrder, ...prevOrders];
      
      // Save to localStorage IMMEDIATELY
      localStorage.setItem('allOrders', JSON.stringify(updatedOrders));
      console.log('Order created and saved:', newOrder.orderId);
      
      // Dispatch event for real-time updates
      setTimeout(() => {
        window.dispatchEvent(new Event('ordersUpdated'));
      }, 100);
      
      return updatedOrders;
    });

    return newOrder;
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order._id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      );
      localStorage.setItem('allOrders', JSON.stringify(updatedOrders));
      window.dispatchEvent(new Event('ordersUpdated'));
      return updatedOrders;
    });
  };

  // Update payment status
  const updatePaymentStatus = (orderId, paymentStatus) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order._id === orderId
          ? { ...order, paymentStatus, updatedAt: new Date().toISOString() }
          : order
      );
      localStorage.setItem('allOrders', JSON.stringify(updatedOrders));
      window.dispatchEvent(new Event('ordersUpdated'));
      return updatedOrders;
    });
  };

  // Get user's orders (for client)
  const getUserOrders = (userEmail) => {
    const userOrders = orders.filter(order => order.userEmail === userEmail);
    return userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  // Get ALL orders (for seller) - FIXED
  const getAllOrders = () => {
    // Re-read from localStorage to ensure we have latest data
    try {
      const savedOrders = localStorage.getItem('allOrders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        // Update state if different
        if (parsedOrders.length !== orders.length) {
          setOrders(parsedOrders);
        }
        return parsedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      }
    } catch (e) {
      console.error('Error reading orders:', e);
    }
    return orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  // Get orders by status
  const getOrdersByStatus = (status) => {
    const allOrders = getAllOrders();
    if (status === 'All') return allOrders;
    return allOrders.filter(order => order.status === status);
  };

  // Get order statistics
  const getOrderStats = () => {
    const allOrders = getAllOrders();
    return {
      totalOrders: allOrders.length,
      pendingOrders: allOrders.filter(o => o.status === 'Pending').length,
      completedOrders: allOrders.filter(o => o.status === 'Delivered').length,
      totalRevenue: allOrders
        .filter(o => o.status === 'Delivered')
        .reduce((sum, order) => sum + order.total, 0)
    };
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order._id === orderId || order.orderId === orderId);
  };

  // Listen for storage changes and custom events
  useEffect(() => {
    const handleUpdate = () => {
      const savedOrders = localStorage.getItem('allOrders');
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          setOrders(parsedOrders);
          console.log('Orders refreshed:', parsedOrders.length);
        } catch (e) {
          console.error('Error parsing orders:', e);
        }
      }
    };

    window.addEventListener('ordersUpdated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'allOrders') handleUpdate();
    });

    return () => {
      window.removeEventListener('ordersUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
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