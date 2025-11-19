import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import './ManageInventory.css';

const ManageInventory = () => {
  const { products, toggleStock, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Get all unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleStockToggle = (productId) => {
    toggleStock(productId);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="manage-inventory-page">
      <div className="inventory-header">
        <div>
          <h1 className="inventory-title">All Products</h1>
          <p className="inventory-subtitle">
            Manage your product inventory and stock status
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="inventory-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-select"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th className="table-header">Product</th>
              <th className="table-header">Category</th>
              <th className="table-header">Selling Price</th>
              <th className="table-header">In Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id} className="table-row">
                  <td className="table-cell product-cell">
                    <div className="product-info">
                      <img 
                        src={product.image[0] || product.image} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60?text=No+Image';
                        }}
                      />
                      <span className="product-name">{product.name}</span>
                    </div>
                  </td>
                  <td className="table-cell">{product.category}</td>
                  <td className="table-cell price-cell">
                    ${product.offerPrice || product.price}
                  </td>
                  <td className="table-cell">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={product.inStock}
                        onChange={() => handleStockToggle(product._id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-products-cell">
                  <div className="no-products-message">
                    <i className="bi bi-inbox"></i>
                    <p>No products found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageInventory;