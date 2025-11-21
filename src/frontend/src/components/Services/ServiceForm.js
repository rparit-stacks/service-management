import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../../services/api';
import './ServiceForm.css';

const ServiceForm = ({ service, serviceRequests, userId, allServices, onClose }) => {
  const [formData, setFormData] = useState({
    jobName: '',
    description: '',
    cost: 0,
    serviceRequestId: '',
    userId: userId || '',
  });
  const [searchJob, setSearchJob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        jobName: service.jobName || '',
        description: service.description || '',
        cost: service.cost || 0,
        serviceRequestId: service.serviceRequestId || '',
        userId: service.userId || userId || '',
      });
    } else {
      setFormData({
        ...formData,
        userId: userId || '',
      });
    }
  }, [service, userId]);

  const filteredJobs = (allServices || []).filter(s =>
    !searchJob ||
    s.jobName?.toLowerCase().includes(searchJob.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchJob.toLowerCase())
  );

  const handleJobSelect = (selectedService) => {
    setFormData({
      ...formData,
      jobName: selectedService.jobName,
      description: selectedService.description || '',
      cost: selectedService.cost || 0,
    });
    setSearchJob('');
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
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
      // Validate required fields
      if (!formData.jobName || formData.jobName.trim() === '') {
        setError('Job name is required');
        setLoading(false);
        return;
      }
      if (!formData.serviceRequestId) {
        setError('Service request is required');
        setLoading(false);
        return;
      }
      // userId is optional now
      if (formData.cost < 0) {
        setError('Cost cannot be negative');
        setLoading(false);
        return;
      }

      const submitData = {
        jobName: formData.jobName.trim(),
        description: formData.description?.trim() || '',
        serviceRequestId: Number(formData.serviceRequestId),
        // userId is optional - only include if provided
        ...(formData.userId ? { userId: Number(formData.userId) } : {}),
        cost: parseFloat(formData.cost) || 0,
      };

      if (service) {
        await serviceAPI.update(service.id, submitData);
      } else {
        await serviceAPI.create(submitData);
      }
      onClose();
    } catch (error) {
      let errorMessage = 'Failed to save service';
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
      console.error('Service save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-tools"></i>
            {service ? 'Edit Service/Job' : 'Create Service/Job'}
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
              <i className="fas fa-search"></i> Job Name * (Search from database)
            </label>
            <input
              type="text"
              name="jobName"
              value={formData.jobName}
              onChange={(e) => {
                setFormData({...formData, jobName: e.target.value});
                setSearchJob(e.target.value);
              }}
              required
              placeholder="Type to search jobs (e.g., washing, clutch change)..."
              className="search-input"
            />
            {searchJob && !formData.jobName && (
              <div className="search-results">
                {filteredJobs.length === 0 ? (
                  <div className="no-results">
                    <i className="fas fa-inbox"></i>
                    No jobs found. Type a new job name.
                  </div>
                ) : (
                  filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className="search-item"
                      onClick={() => handleJobSelect(job)}
                    >
                      <div className="item-info">
                        <strong>{job.jobName} (ID: {job.id})</strong>
                        <span>{job.description || 'No description'}</span>
                        <span>Cost: ₹{job.cost?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {formData.jobName && (
              <div className="selected-job">
                <i className="fas fa-check-circle"></i>
                Selected: {formData.jobName}
              </div>
            )}
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
            <label>Cost *</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Service Request *</label>
            <select
              name="serviceRequestId"
              value={formData.serviceRequestId}
              onChange={handleChange}
              required
            >
              <option value="">Select Service Request</option>
              {serviceRequests.map((sr) => (
                <option key={sr.id} value={sr.id}>
                  Request #{sr.id} - {sr.vehicleNumber} ({sr.status})
                </option>
              ))}
            </select>
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
                  {service ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
