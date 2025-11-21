import React, { useState, useEffect } from 'react';
import { vehicleAPI, customerAPI } from '../../services/api';
import './VehicleForm.css';

const VehicleForm = ({ vehicle, customers, onClose }) => {
  const [formData, setFormData] = useState({
    number: '',
    model: '',
    type: '',
    customerId: '',
    brandId: null,
  });
  const [createNewCustomer, setCreateNewCustomer] = useState(false);
  const [customerData, setCustomerData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [searchCustomer, setSearchCustomer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        number: vehicle.number || '',
        model: vehicle.model || '',
        type: vehicle.type || '',
        customerId: vehicle.customerId || '',
        brandId: vehicle.brandId || null,
      });
    }
  }, [vehicle]);

  const filteredCustomers = customers.filter(c =>
    !searchCustomer ||
    c.fullName?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    c.phone?.includes(searchCustomer)
  );

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError('');
  };

  const handleCustomerDataChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomerSelect = (customerId) => {
    setFormData({
      ...formData,
      customerId: customerId,
    });
    setCreateNewCustomer(false);
    setSearchCustomer('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate vehicle number
      if (!formData.number || formData.number.trim() === '') {
        setError('Vehicle number is required');
        setLoading(false);
        return;
      }

      // Validate customer selection
      if (!createNewCustomer && !formData.customerId) {
        setError('Please select a customer or create a new one');
        setLoading(false);
        return;
      }

      let customerId = formData.customerId;

      // Create customer if new
      if (createNewCustomer) {
        if (!customerData.fullName || !customerData.email || !customerData.phone) {
          setError('Please fill all customer fields (Name, Email, Phone)');
          setLoading(false);
          return;
        }
        try {
          const customerRes = await customerAPI.create(customerData);
          customerId = customerRes.data.id;
        } catch (error) {
          const errorMsg = error.response?.data?.message || 
                          error.response?.data?.validationErrors ? 
                          Object.values(error.response.data.validationErrors).join(', ') :
                          'Failed to create customer';
          setError(errorMsg);
          setLoading(false);
          return;
        }
      }

      if (!customerId) {
        setError('Customer is required');
        setLoading(false);
        return;
      }

      const submitData = {
        number: formData.number.trim(),
        model: formData.model?.trim() || '',
        type: formData.type?.trim() || '',
        customerId: Number(customerId),
        brandId: formData.brandId || null,
      };

      if (vehicle) {
        await vehicleAPI.update(vehicle.id, submitData);
      } else {
        await vehicleAPI.create(submitData);
      }
      onClose();
    } catch (error) {
      let errorMessage = 'Failed to save vehicle';
      if (error.response?.data) {
        if (error.response.data.validationErrors) {
          errorMessage = Object.values(error.response.data.validationErrors).join(', ');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      console.error('Vehicle save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-car"></i>
            {vehicle ? 'Edit Vehicle' : 'Create Vehicle'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Vehicle Number - Always visible first */}
          <div className="form-group">
            <label>
              <i className="fas fa-car"></i> Vehicle Number *
            </label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Enter vehicle number (e.g., ABC1234)"
              required
              autoComplete="off"
              style={{ marginBottom: '8px' }}
            />
            <small style={{ color: '#757575', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Vehicle registration number is required
            </small>
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-user"></i> Customer *
            </label>
            
            {!createNewCustomer ? (
              <>
                <input
                  type="text"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  placeholder="Search customer by name, email, or phone..."
                  className="search-input"
                />
                {searchCustomer && (
                  <div className="search-results">
                    {filteredCustomers.length === 0 ? (
                      <div className="no-results">
                        <i className="fas fa-inbox"></i>
                        No customers found
                      </div>
                    ) : (
                      filteredCustomers.map(customer => (
                        <div
                          key={customer.id}
                          className={`search-item ${formData.customerId === customer.id.toString() ? 'selected' : ''}`}
                          onClick={() => handleCustomerSelect(customer.id)}
                        >
                          <div className="item-info">
                            <strong>{customer.fullName} (ID: {customer.id})</strong>
                            <span>{customer.email} | {customer.phone}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                {formData.customerId && (
                  <div className="selected-customer">
                    <i className="fas fa-check-circle"></i>
                    Selected: {customers.find(c => c.id === Number(formData.customerId))?.fullName}
                  </div>
                )}
                <div className="divider">
                  <span>OR</span>
                </div>
                <button
                  type="button"
                  className="btn-create-new"
                  onClick={() => {
                    setCreateNewCustomer(true);
                    setFormData({...formData, customerId: ''});
                    setSearchCustomer('');
                  }}
                >
                  <i className="fas fa-plus"></i>
                  Create New Customer
                </button>
              </>
            ) : (
              <>
                <div className="create-customer-form">
                  <h4>Customer Details *</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={customerData.fullName}
                        onChange={handleCustomerDataChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={customerData.email}
                        onChange={handleCustomerDataChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerData.phone}
                      onChange={handleCustomerDataChange}
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setCreateNewCustomer(false);
                    setCustomerData({ fullName: '', email: '', phone: '' });
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                  Select Existing Customer
                </button>
              </>
            )}
          </div>

          <div className="form-group">
            <label>Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  {vehicle ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
