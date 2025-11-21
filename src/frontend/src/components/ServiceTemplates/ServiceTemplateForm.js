import React, { useState, useEffect } from 'react';
import { serviceTemplateAPI } from '../../services/api';
import './ServiceTemplateForm.css';

const ServiceTemplateForm = ({ template, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaultCost: 0,
    active: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        description: template.description || '',
        defaultCost: template.defaultCost || 0,
        active: template.active !== undefined ? template.active : true,
      });
    }
  }, [template]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.type === 'number' 
        ? parseFloat(e.target.value) || 0 
        : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (template) {
        await serviceTemplateAPI.update(template.id, formData);
      } else {
        await serviceTemplateAPI.create(formData);
      }
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to save service template'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-list-alt"></i>
            {template ? 'Edit Service Template' : 'Create Service Template'}
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
          <div className="form-group">
            <label>
              <i className="fas fa-tag"></i> Service Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Washing, Clutch Change, Parts Replacement"
            />
          </div>
          <div className="form-group">
            <label>
              <i className="fas fa-align-left"></i> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the service..."
            />
          </div>
          <div className="form-group">
            <label>
              <i className="fas fa-rupee-sign"></i> Default Cost (₹) *
            </label>
            <input
              type="number"
              name="defaultCost"
              value={formData.defaultCost}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
            <small style={{ color: '#757575', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              This is the default cost. It can be edited when creating a service request.
            </small>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <span>Active (visible in service request creation)</span>
            </label>
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
                  {template ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceTemplateForm;

