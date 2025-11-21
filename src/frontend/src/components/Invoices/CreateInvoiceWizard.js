import React, { useState, useEffect } from 'react';
import { serviceRequestAPI, invoiceAPI } from '../../services/api';
import './CreateInvoiceWizard.css';

const CreateInvoiceWizard = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  
  // Data
  const [serviceRequests, setServiceRequests] = useState([]);
  const [searchServiceRequest, setSearchServiceRequest] = useState('');
  const [selectedServiceRequest, setSelectedServiceRequest] = useState(null);
  
  // Form data
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('UNPAID');
  const [dueDays, setDueDays] = useState(30);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServiceRequests();
  }, []);

  const loadServiceRequests = async () => {
    try {
      const res = await serviceRequestAPI.getAll();
      // Filter only COMPLETED service requests that don't have invoices yet
      setServiceRequests(res.data.filter(sr => sr.status === 'COMPLETED'));
    } catch (error) {
      console.error('Error loading service requests:', error);
    }
  };

  const filteredServiceRequests = serviceRequests.filter(sr => {
    if (!searchServiceRequest) return true;
    const search = searchServiceRequest.toLowerCase();
    return (
      sr.id?.toString().includes(search) ||
      sr.vehicleNumber?.toLowerCase().includes(search) ||
      sr.customerName?.toLowerCase().includes(search) ||
      sr.description?.toLowerCase().includes(search)
    );
  });

  const handleServiceRequestSelect = (sr) => {
    setSelectedServiceRequest(sr);
    setSearchServiceRequest('');
  };

  const calculateSubtotal = () => {
    if (!selectedServiceRequest || !selectedServiceRequest.jobs) return 0;
    return selectedServiceRequest.jobs.reduce((sum, job) => sum + (job.cost || 0), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = (subtotal * tax) / 100;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal + taxAmount - discountAmount;
  };

  const validateStep1 = () => {
    if (!selectedServiceRequest) {
      setError('Please select a service request');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && !validateStep1()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);

    try {
      await invoiceAPI.create({
        serviceRequestId: selectedServiceRequest.id,
        tax: tax,
        discount: discount,
        paymentStatus: paymentStatus,
        dueDays: dueDays,
        notes: selectedServiceRequest.description || '',
      });

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create invoice');
      console.error('Error creating invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content invoice-wizard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-file-invoice"></i>
            Create Invoice
          </h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="wizard-steps">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Select Service Request</span>
          </div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment & Save</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <div className="wizard-content">
          {/* Step 1: Select Service Request */}
          {step === 1 && (
            <div className="wizard-step">
              <h3>
                <i className="fas fa-clipboard-list"></i>
                Select Service Request
              </h3>
              <p className="step-description">
                Select a completed service request to create an invoice. Only service requests with status "COMPLETED" are shown.
              </p>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-search"></i> Search Service Request
                </label>
                <input
                  type="text"
                  value={searchServiceRequest}
                  onChange={(e) => setSearchServiceRequest(e.target.value)}
                  placeholder="Search by ID, vehicle number, customer name, or description..."
                  className="search-input"
                />
              </div>

              {searchServiceRequest && (
                <div className="search-results">
                  {filteredServiceRequests.length === 0 ? (
                    <div className="no-results">
                      <i className="fas fa-inbox"></i>
                      No service requests found
                    </div>
                  ) : (
                    filteredServiceRequests.map(sr => (
                      <div
                        key={sr.id}
                        className={`search-item ${selectedServiceRequest?.id === sr.id ? 'selected' : ''}`}
                        onClick={() => handleServiceRequestSelect(sr)}
                      >
                        <div className="item-info">
                          <strong>Service Request #{sr.id}</strong>
                          <span>Vehicle: {sr.vehicleNumber} | Customer: {sr.customerName}</span>
                          <span>Status: {sr.status} | Jobs: {sr.jobs?.length || 0}</span>
                          {sr.description && <span>Description: {sr.description}</span>}
                        </div>
                        <div className="item-id">ID: {sr.id}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {selectedServiceRequest && (
                <div className="selected-info">
                  <h4>Selected Service Request:</h4>
                  <div className="info-card">
                    <p><strong>Service Request ID:</strong> {selectedServiceRequest.id}</p>
                    <p><strong>Vehicle:</strong> {selectedServiceRequest.vehicleNumber}</p>
                    <p><strong>Customer:</strong> {selectedServiceRequest.customerName}</p>
                    <p><strong>Status:</strong> {selectedServiceRequest.status}</p>
                    {selectedServiceRequest.description && (
                      <p><strong>Description:</strong> {selectedServiceRequest.description}</p>
                    )}
                    {selectedServiceRequest.jobs && selectedServiceRequest.jobs.length > 0 && (
                      <div>
                        <p><strong>Services/Jobs ({selectedServiceRequest.jobs.length}):</strong></p>
                        <table className="services-table">
                          <thead>
                            <tr>
                              <th>Job Name</th>
                              <th>Description</th>
                              <th>Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedServiceRequest.jobs.map(job => (
                              <tr key={job.id}>
                                <td>{job.jobName}</td>
                                <td>{job.description || 'N/A'}</td>
                                <td>₹{job.cost?.toFixed(2) || '0.00'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="cost-summary">
                          <div className="summary-row total">
                            <span>Subtotal:</span>
                            <span>₹{calculateSubtotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment & Save */}
          {step === 2 && (
            <div className="wizard-step">
              <h3>
                <i className="fas fa-money-bill-wave"></i>
                Payment & Finalize
              </h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Tax (%)</label>
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Status *</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    required
                  >
                    <option value="PAID">PAID</option>
                    <option value="UNPAID">UNPAID</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Days</label>
                  <input
                    type="number"
                    value={dueDays}
                    onChange={(e) => setDueDays(parseInt(e.target.value) || 30)}
                    min="0"
                  />
                </div>
              </div>

              <div className="final-summary">
                <h4>Invoice Summary</h4>
                <div className="summary-card">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax ({tax}%):</span>
                    <span>₹{((calculateSubtotal() * tax) / 100).toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Discount ({discount}%):</span>
                    <span>-₹{((calculateSubtotal() * discount) / 100).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="wizard-actions">
          {step > 1 && (
            <button type="button" className="btn-secondary" onClick={handleBack}>
              <i className="fas fa-arrow-left"></i>
              Back
            </button>
          )}
          {step < 2 ? (
            <button type="button" className="btn-primary" onClick={handleNext}>
              Next
              <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Invoice
                </>
              )}
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={onClose}>
            <i className="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceWizard;
