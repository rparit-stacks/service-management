import React, { useState, useEffect } from 'react';
import { invoiceAPI, serviceRequestAPI, serviceAPI } from '../../services/api';
import './InvoiceForm.css';

const InvoiceForm = ({ invoice, onClose }) => {
  const [formData, setFormData] = useState({
    serviceRequestId: '',
    tax: 0,
    discount: 0,
    paymentStatus: 'PAID',
    notes: '',
    dueDays: 0,
  });
  const [serviceRequests, setServiceRequests] = useState([]);
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.serviceRequestId) {
      loadServiceRequestDetails(formData.serviceRequestId);
    }
  }, [formData.serviceRequestId]);

  useEffect(() => {
    if (invoice) {
      // Calculate tax and discount percentages from absolute amounts
      const subtotal = invoice.subtotal || 0;
      const taxPercent = subtotal > 0 ? ((invoice.tax || 0) / subtotal) * 100 : 0;
      const discountPercent = subtotal > 0 ? ((invoice.discount || 0) / subtotal) * 100 : 0;
      
      setFormData({
        serviceRequestId: invoice.serviceRequestId || '',
        tax: taxPercent,
        discount: discountPercent,
        paymentStatus: invoice.paymentStatus || 'PAID',
        notes: invoice.notes || '',
        dueDays: 0,
      });
      if (invoice.serviceRequestId) {
        loadServiceRequestDetails(invoice.serviceRequestId);
      }
    }
  }, [invoice]);

  const loadInitialData = async () => {
    try {
      const response = await serviceRequestAPI.getAll();
      setServiceRequests(response.data);
    } catch (error) {
      console.error('Error loading service requests:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadServiceRequestDetails = async (serviceRequestId) => {
    try {
      const [srResponse, servicesResponse] = await Promise.all([
        serviceRequestAPI.getById(serviceRequestId),
        serviceAPI.getAll(),
      ]);
      const sr = srResponse.data;
      setSelectedServiceRequest(sr);
      // Filter services for this service request
      const filteredServices = servicesResponse.data.filter(
        (s) => s.serviceRequestId === serviceRequestId
      );
      setServices(filteredServices);
    } catch (error) {
      console.error('Error loading service request details:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError('');
  };

  const calculateSubtotal = () => {
    return services.reduce((sum, service) => sum + (service.cost || 0), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * formData.tax) / 100;
    const discountAmount = (subtotal * formData.discount) / 100;
    return subtotal + taxAmount - discountAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        serviceRequestId: Number(formData.serviceRequestId),
        tax: parseFloat(formData.tax) || 0,
        discount: parseFloat(formData.discount) || 0,
        paymentStatus: formData.paymentStatus,
        notes: formData.notes,
        dueDays: formData.dueDays ? Number(formData.dueDays) : null,
      };
      if (invoice) {
        await invoiceAPI.update(invoice.id, submitData);
      } else {
        await invoiceAPI.create(submitData);
      }
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || 'Failed to save invoice'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const taxAmount = (subtotal * formData.tax) / 100;
  const discountAmount = (subtotal * formData.discount) / 100;
  const total = calculateTotal();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content invoice-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{invoice ? 'Edit Invoice' : 'Create Invoice'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Service Request *</label>
            <select
              name="serviceRequestId"
              value={formData.serviceRequestId}
              onChange={handleChange}
              required
              disabled={!!invoice}
            >
              <option value="">Select Service Request</option>
              {serviceRequests.map((sr) => (
                <option key={sr.id} value={sr.id}>
                  Request #{sr.id} - Vehicle: {sr.vehicleNumber} ({sr.status})
                </option>
              ))}
            </select>
          </div>

          {selectedServiceRequest && (
            <div className="service-request-info">
              <h3>Service Request Details</h3>
              <p><strong>Vehicle:</strong> {selectedServiceRequest.vehicleNumber}</p>
              <p><strong>Status:</strong> {selectedServiceRequest.status}</p>
              {selectedServiceRequest.description && (
                <p><strong>Description:</strong> {selectedServiceRequest.description}</p>
              )}
            </div>
          )}

          {services.length > 0 && (
            <div className="services-list">
              <h3>Services/Jobs</h3>
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Job Name</th>
                    <th>Description</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.jobName}</td>
                      <td>{service.description || 'N/A'}</td>
                      <td>₹{service.cost?.toFixed(2) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Tax (%)</label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Payment Status * (Cash Only)</label>
            <select
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              required
            >
              <option value="PAID">PAID (Cash)</option>
              <option value="UNPAID">UNPAID</option>
            </select>
            <small style={{ color: '#666', fontSize: '12px' }}>
              Note: Payment method is Cash only
            </small>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="invoice-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax ({formData.tax}%):</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Discount ({formData.discount}%):</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : invoice ? 'Update' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;

