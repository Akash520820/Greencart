// AddressModal.jsx - Optimized for All Screen Sizes
import React, { memo } from 'react';

const AddressModal = memo(({ 
  show,
  addresses,
  selectedAddress,
  newAddress,
  onClose,
  onAddressSelect,
  onAddressChange,
  onSubmit
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="address-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delivery Address</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {addresses.length > 0 && (
            <div className="saved-addresses">
              <h3>Saved Addresses</h3>
              <div className="saved-addresses-list">
                {addresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    className={`saved-address-item ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
                    onClick={() => onAddressSelect(addr)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="address-radio">
                      {selectedAddress?.id === addr.id && <div className="radio-dot"></div>}
                    </div>
                    <div className="address-info">
                      <p className="addr-name">{addr.fullName}</p>
                      <p className="addr-text">
                        {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}
                      </p>
                      <p className="addr-text">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="addr-phone">Phone: {addr.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="add-new-address">
            <h3>Add New Address</h3>
            <form onSubmit={onSubmit} className="address-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={newAddress.fullName}
                  onChange={(e) => onAddressChange({...newAddress, fullName: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={newAddress.phone}
                  onChange={(e) => onAddressChange({...newAddress, phone: e.target.value})}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                />
              </div>

              <div className="form-group">
                <label htmlFor="addressLine1">Address Line 1 *</label>
                <input
                  id="addressLine1"
                  type="text"
                  required
                  value={newAddress.addressLine1}
                  onChange={(e) => onAddressChange({...newAddress, addressLine1: e.target.value})}
                  placeholder="House No., Building Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="addressLine2">Address Line 2</label>
                <input
                  id="addressLine2"
                  type="text"
                  value={newAddress.addressLine2}
                  onChange={(e) => onAddressChange({...newAddress, addressLine2: e.target.value})}
                  placeholder="Road Name, Area, Colony"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => onAddressChange({...newAddress, city: e.target.value})}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    id="state"
                    type="text"
                    required
                    value={newAddress.state}
                    onChange={(e) => onAddressChange({...newAddress, state: e.target.value})}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  id="pincode"
                  type="text"
                  required
                  value={newAddress.pincode}
                  onChange={(e) => onAddressChange({...newAddress, pincode: e.target.value})}
                  placeholder="6-digit pincode"
                  pattern="[0-9]{6}"
                />
              </div>

              <button type="submit" className="submit-address-btn">
                Save & Use This Address
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

AddressModal.displayName = 'AddressModal';

export default AddressModal;