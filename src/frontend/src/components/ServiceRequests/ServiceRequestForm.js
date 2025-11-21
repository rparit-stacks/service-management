import React, { useState, useEffect } from 'react';
import { serviceRequestAPI } from '../../services/api';
import './ServiceRequestForm.css';

const ServiceRequestForm = ({ serviceRequest, vehicles, onClose }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    status: 'PENDING',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serviceRequest) {
      setFormData({
        vehicleId: serviceRequest.vehicleId || '',
        description: serviceRequest.description || '',
        status: serviceRequest.status || 'PENDING',
      });
    }
  }, [serviceRequest]);

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
      const submitData = {
        ...formData,
        vehicleId: Number(formData.vehicleId),
      };
      if (serviceRequest) {
        await serviceRequestAPI.update(serviceRequest.id, submitData);
      } else {
        await serviceRequestAPI.create(submitData);
      }
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to save service request'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{serviceRequest ? 'Edit Service Request' : 'Create Service Request'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vehicle *</label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.number} - {vehicle.customerName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : serviceRequest ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestForm;

