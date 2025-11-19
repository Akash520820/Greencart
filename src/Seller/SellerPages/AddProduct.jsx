import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useSellerAuth } from '../../context/SellerAuthContext';
import toast, { Toaster } from 'react-hot-toast';
import './AddProduct.css';

// Image compression utility
const compressImage = (file, maxWidth = 600, maxHeight = 600, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.onerror = reject;
      img.src = e.target.result;
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { seller } = useSellerAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    offerPrice: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Dairy',
    'Bakery',
    'Snacks',
    'Drinks',
    'Instant'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload only image files');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      try {
        // Show loading toast
        const loadingToast = toast.loading('Compressing image...');
        
        // Compress image
        const compressedBase64 = await compressImage(file);
        
        // Calculate size reduction
        const originalSize = (file.size / 1024).toFixed(2);
        const compressedSize = ((compressedBase64.length * 3) / 4 / 1024).toFixed(2);
        
        toast.success(
          `Image compressed: ${originalSize}KB → ${compressedSize}KB`,
          { id: loadingToast }
        );

        const newPreviews = [...imagePreviews];
        newPreviews[index] = compressedBase64;
        setImagePreviews(newPreviews);

        const newImages = [...formData.images];
        newImages[index] = compressedBase64;
        setFormData(prev => ({
          ...prev,
          images: newImages
        }));
      } catch (error) {
        console.error('Compression error:', error);
        toast.error('Failed to compress image');
      }
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);

    const newImages = [...formData.images];
    newImages[index] = null;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      setLoading(false);
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      setLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      setLoading(false);
      return;
    }

    const filteredImages = formData.images.filter(img => img);
    if (!filteredImages.length) {
      toast.error('Please upload at least one image');
      setLoading(false);
      return;
    }

    try {
      // Check localStorage space before adding
      const storageTest = () => {
        try {
          const testKey = '__storage_test__';
          localStorage.setItem(testKey, 'test');
          localStorage.removeItem(testKey);
          return true;
        } catch (e) {
          return false;
        }
      };

      if (!storageTest()) {
        toast.error('Storage quota exceeded. Please delete some products first.');
        setLoading(false);
        return;
      }

      const newProduct = addProduct({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        offerPrice: formData.offerPrice,
        images: filteredImages,
        sellerId: seller?.id || 'default-seller'
      });

      toast.success('Product added successfully! 🎉', {
        duration: 2000,
        position: 'top-center',
      });

      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        offerPrice: '',
        images: []
      });
      setImagePreviews([null, null, null, null]);

      setTimeout(() => {
        navigate('/seller/inventory');
      }, 1000);

    } catch (err) {
      console.error('Error adding product:', err);
      
      if (err.name === 'QuotaExceededError') {
        toast.error('Storage quota exceeded! Please delete old products or use smaller images.');
      } else {
        toast.error('Failed to add product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <Toaster />
      
      <div className="add-product-header">
        <h1 className="add-product-title">Add New Product</h1>
        <p className="add-product-subtitle">Add your product details and images (images will be compressed automatically)</p>
      </div>

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-section">
          <label className="form-label">Product Images (Max 4)</label>
          <div className="image-upload-grid">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="image-upload-box">
                {preview ? (
                  <div className="image-preview-container">
                    <img src={preview} alt={`Preview ${index + 1}`} className="image-preview" />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </button>
                  </div>
                ) : (
                  <label className="upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="file-input"
                    />
                    <i className="bi bi-cloud-upload upload-icon"></i>
                    <span className="upload-text">Upload</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Type here"
            className="form-input"
            required
          />
        </div>

        <div className="form-section">
          <label htmlFor="description" className="form-label">Product Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Type here"
            className="form-textarea"
            rows="4"
          ></textarea>
        </div>

        <div className="form-section">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-section form-section-half">
            <label htmlFor="price" className="form-label">Product Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0"
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-section form-section-half">
            <label htmlFor="offerPrice" className="form-label">Offer Price</label>
            <input
              type="number"
              id="offerPrice"
              name="offerPrice"
              value={formData.offerPrice}
              onChange={handleInputChange}
              placeholder="0"
              className="form-input"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Adding Product...' : 'ADD'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;