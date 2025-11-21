import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { FiSearch, FiInbox } from 'react-icons/fi';
import './ManageInventory.css';

const ManageInventory = () => {
  const { products, toggleStock, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];

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
      <div className="seller-loading-container">
        <div className="seller-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="seller-inventory-page">
      <div className="seller-inventory-header">
        <div>
          <h1 className="seller-inventory-title">
            All Products
            <span className="seller-stats-badge">{filteredProducts.length} Items</span>
          </h1>
          <p className="seller-inventory-subtitle">
            Manage your product inventory and stock status
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="seller-inventory-filters">
        <div className="seller-search-wrapper">
          <FiSearch className="seller-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="seller-search-input"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="seller-category-select"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="seller-inventory-table-container seller-desktop-view">
        <table className="seller-inventory-table">
          <thead>
            <tr>
              <th className="seller-table-header">Product</th>
              <th className="seller-table-header">Category</th>
              <th className="seller-table-header">Selling Price</th>
              <th className="seller-table-header">In Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product._id} className="seller-table-row">
                  <td className="seller-table-cell seller-product-cell">
                    <div className="seller-product-info">
                      <img 
                        src={product.image[0] || product.image} 
                        alt={product.name}
                        className="seller-product-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/70?text=No+Image';
                        }}
                      />
                      <span className="seller-product-name">{product.name}</span>
                    </div>
                  </td>
                  <td className="seller-table-cell seller-category-cell">
                    {product.category}
                  </td>
                  <td className="seller-table-cell seller-price-cell">
                    ${product.offerPrice || product.price}
                  </td>
                  <td className="seller-table-cell">
                    <label className="seller-toggle-switch">
                      <input
                        type="checkbox"
                        checked={product.inStock}
                        onChange={() => handleStockToggle(product._id)}
                      />
                      <span className="seller-toggle-slider"></span>
                    </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="seller-no-products-cell">
                  <div className="seller-no-products-message">
                    <FiInbox size={48} />
                    <p>No products found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="seller-mobile-view">
        {filteredProducts.length > 0 ? (
          <div className="seller-product-cards">
            {filteredProducts.map((product) => (
              <div key={product._id} className="seller-product-card">
                <div className="seller-card-left">
                  <img 
                    src={product.image[0] || product.image} 
                    alt={product.name}
                    className="seller-card-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/70?text=No+Image';
                    }}
                  />
                </div>
                <div className="seller-card-content">
                  <h3 className="seller-card-title">{product.name}</h3>
                  <span className="seller-card-category">{product.category}</span>
                  <div className="seller-card-footer">
                    <span className="seller-card-price">
                      ${product.offerPrice || product.price}
                    </span>
                    <div className="seller-card-stock">
                      <span className={`seller-stock-label ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <label className="seller-toggle-switch seller-toggle-small">
                        <input
                          type="checkbox"
                          checked={product.inStock}
                          onChange={() => handleStockToggle(product._id)}
                        />
                        <span className="seller-toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="seller-no-products-mobile">
            <FiInbox size={48} />
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInventory;