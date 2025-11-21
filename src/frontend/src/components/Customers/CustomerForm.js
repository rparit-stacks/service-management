import React, { useState, useEffect } from 'react';
import { customerAPI } from '../../services/api';
import './CustomerForm.css';

const CustomerForm = ({ customer, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        fullName: customer.fullName || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone) {
        setError('Please fill all required fields (Name, Email, Phone)');
        setLoading(false);
        return;
      }

      const submitData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      if (customer) {
        await customerAPI.update(customer.id, submitData);
      } else {
        await customerAPI.create(submitData);
      }
      onClose();
    } catch (error) {
      let errorMessage = 'Failed to save customer';
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
      console.error('Customer save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{customer ? 'Edit Customer' : 'Create Customer'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : customer ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;

