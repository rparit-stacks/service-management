import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { vehicleAPI, serviceRequestAPI, serviceAPI, serviceTemplateAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './CreateServiceWizard.css';

const CreateServiceWizard = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [serviceTemplates, setServiceTemplates] = useState([]);
  const [searchVehicle, setSearchVehicle] = useState('');
  const [searchTemplate, setSearchTemplate] = useState('');
  
  // Form data
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [serviceRequestDescription, setServiceRequestDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [vehiclesRes, templatesRes] = await Promise.all([
        vehicleAPI.getAll(),
        serviceTemplateAPI.getActive(), // Get active service templates
      ]);
      setVehicles(vehiclesRes.data);
      setServiceTemplates(templatesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filteredVehicles = useMemo(() => {
    if (!searchVehicle) return vehicles;
    const search = searchVehicle.toLowerCase();
    return vehicles.filter(v =>
      v.number?.toLowerCase().includes(search) ||
      v.customerName?.toLowerCase().includes(search) ||
      v.model?.toLowerCase().includes(search)
    );
  }, [vehicles, searchVehicle]);

  const filteredTemplates = useMemo(() => {
    if (!searchTemplate) return serviceTemplates;
    const search = searchTemplate.toLowerCase();
    return serviceTemplates.filter(t =>
      t.name?.toLowerCase().includes(search) ||
      t.description?.toLowerCase().includes(search)
    );
  }, [serviceTemplates, searchTemplate]);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSearchVehicle('');
  };

  const handleTemplateToggle = useCallback((template) => {
    setSelectedTemplates(prev => {
      const exists = prev.find(t => t.id === template.id);
      if (exists) {
        return prev.filter(t => t.id !== template.id);
      } else {
        return [...prev, { 
          ...template, 
          cost: parseFloat(template.defaultCost) || 0 
        }];
      }
    });
  }, []);

  const handleTemplateCostChange = useCallback((templateId, cost) => {
    setSelectedTemplates(prev =>
      prev.map(t =>
        t.id === templateId ? { ...t, cost: parseFloat(cost) || 0 } : t
      )
    );
  }, []);

  const calculateSubtotal = () => {
    return selectedTemplates.reduce((sum, t) => sum + (t.cost || 0), 0);
  };

  const validateStep1 = () => {
    if (!selectedVehicle) {
      setError('Please select a vehicle');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (selectedTemplates.length === 0) {
      setError('Please select at least one service template');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
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
      // Step 1: Create service request
      const serviceRequestRes = await serviceRequestAPI.create({
        vehicleId: selectedVehicle.id,
        description: serviceRequestDescription,
        status: 'COMPLETED',
      });
      const serviceRequestId = serviceRequestRes.data.id;

      // Step 2: Create services/jobs from selected templates
      for (const template of selectedTemplates) {
        await serviceAPI.create({
          jobName: template.name,
          description: template.description || '',
          cost: template.cost || 0,
          serviceRequestId: serviceRequestId,
          // userId is optional - don't pass it if not needed
          // userId: user?.id,
          serviceTemplateId: template.id, // Link to service template
        });
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save service request');
      console.error('Error saving service request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wizard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Service Request</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="wizard-steps">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Select Vehicle</span>
          </div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Select Service Templates</span>
          </div>
          <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Overview</span>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="wizard-content">
          {/* Step 1: Select Vehicle */}
          {step === 1 && (
            <div className="wizard-step">
              <h3>Select Vehicle</h3>
              <p className="step-description">
                Select a vehicle. Customer information is automatically included from the vehicle.
              </p>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-search"></i> Search Vehicle
                </label>
                <input
                  type="text"
                  value={searchVehicle}
                  onChange={(e) => setSearchVehicle(e.target.value)}
                  placeholder="Search by vehicle number, customer name, or model..."
                  className="search-input"
                />
              </div>

              {searchVehicle && (
                <div className="search-results">
                  {filteredVehicles.length === 0 ? (
                    <div className="no-results">
                      <i className="fas fa-inbox"></i>
                      No vehicles found
                    </div>
                  ) : (
                    filteredVehicles.map(vehicle => (
                      <div
                        key={vehicle.id}
                        className={`search-item ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                        onClick={() => handleVehicleSelect(vehicle)}
                      >
                        <div className="item-info">
                          <strong>Vehicle #{vehicle.number}</strong>
                          <span>Customer: {vehicle.customerName} (ID: {vehicle.customerId})</span>
                          <span>Model: {vehicle.model || 'N/A'} | Type: {vehicle.type || 'N/A'}</span>
                        </div>
                        <div className="item-id">ID: {vehicle.id}</div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {selectedVehicle && (
                <div className="selected-info">
                  <h4>Selected Vehicle:</h4>
                  <div className="info-card">
                    <p><strong>Vehicle ID:</strong> {selectedVehicle.id}</p>
                    <p><strong>Vehicle Number:</strong> {selectedVehicle.number}</p>
                    <p><strong>Customer ID:</strong> {selectedVehicle.customerId}</p>
                    <p><strong>Customer Name:</strong> {selectedVehicle.customerName}</p>
                    <p><strong>Model:</strong> {selectedVehicle.model || 'N/A'}</p>
                    <p><strong>Type:</strong> {selectedVehicle.type || 'N/A'}</p>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Service Description</label>
                <textarea
                  value={serviceRequestDescription}
                  onChange={(e) => setServiceRequestDescription(e.target.value)}
                  rows="3"
                  placeholder="Describe the service required..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Select Service Templates */}
          {step === 2 && (
            <div className="wizard-step">
              <h3>
                <i className="fas fa-tools"></i>
                Select Service Templates
              </h3>
              <p className="step-description">
                Select service templates from the master list. You can adjust the cost for each service.
              </p>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-search"></i> Search Service Templates
                </label>
                <input
                  type="text"
                  value={searchTemplate}
                  onChange={(e) => setSearchTemplate(e.target.value)}
                  placeholder="Type to search service templates..."
                  className="search-input"
                />
              </div>

              <div className="jobs-section">
                <div className="available-jobs">
                  <h4>
                    <i className="fas fa-list"></i>
                    Available Service Templates
                  </h4>
                  {filteredTemplates.length === 0 ? (
                    <div className="no-results">
                      <i className="fas fa-inbox"></i>
                      {searchTemplate ? 'No templates found matching your search' : 'No service templates available. Create templates first in Service Templates section.'}
                    </div>
                  ) : (
                    <div className="jobs-list">
                      {filteredTemplates.map(template => {
                        const isSelected = selectedTemplates.find(t => t.id === template.id);
                        return (
                          <div
                            key={`template-${template.id}`}
                            className={`job-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleTemplateToggle(template)}
                          >
                            <div className="job-checkbox">
                              <input
                                type="checkbox"
                                checked={!!isSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleTemplateToggle(template);
                                }}
                              />
                            </div>
                            <div className="job-info">
                              <strong>{template.name} (ID: {template.id})</strong>
                              <span className="job-description">{template.description || 'No description'}</span>
                              <span className="job-cost">Default Cost: ₹{template.defaultCost?.toFixed(2) || '0.00'}</span>
                            </div>
                            {isSelected && (
                              <div className="job-cost-input" onClick={(e) => e.stopPropagation()}>
                                <label>Edit Cost (₹):</label>
                                <input
                                  type="number"
                                  value={isSelected.cost || template.defaultCost}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    handleTemplateCostChange(template.id, e.target.value);
                                  }}
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="selected-jobs-list">
                  <h4>
                    <i className="fas fa-check-circle"></i>
                    Selected Service Templates ({selectedTemplates.length})
                  </h4>
                  {selectedTemplates.length === 0 ? (
                    <div className="empty-selected">
                      <i className="fas fa-inbox"></i>
                      <p>No templates selected yet. Select templates from the list above.</p>
                    </div>
                  ) : (
                    <>
                      <div className="selected-jobs-items">
                        {selectedTemplates.map((template, index) => (
                          <div key={`selected-template-${template.id}-${index}`} className="selected-job-item">
                            <div className="job-number">{index + 1}</div>
                            <div className="job-details">
                              <strong>{template.name} (ID: {template.id})</strong>
                              <span>{template.description || 'No description'}</span>
                              <span className="job-cost-display">Cost: ₹{template.cost?.toFixed(2) || '0.00'}</span>
                            </div>
                            <button
                              type="button"
                              className="remove-job-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTemplateToggle(template);
                              }}
                              title="Remove template"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="selected-jobs-summary">
                        <div className="summary-row">
                          <span>Total Services:</span>
                          <span>{selectedTemplates.length}</span>
                        </div>
                        <div className="summary-row total">
                          <span>Subtotal:</span>
                          <span>₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Overview */}
          {step === 3 && (
            <div className="wizard-step">
              <h3>Service Request Overview</h3>
              
              <div className="overview-section">
                <h4>Vehicle & Customer Information</h4>
                <div className="info-card">
                  <p><strong>Vehicle Number:</strong> {selectedVehicle?.number}</p>
                  <p><strong>Vehicle Model:</strong> {selectedVehicle?.model || 'N/A'}</p>
                  <p><strong>Vehicle Type:</strong> {selectedVehicle?.type || 'N/A'}</p>
                  <p><strong>Customer Name:</strong> {selectedVehicle?.customerName}</p>
                  <p><strong>Customer ID:</strong> {selectedVehicle?.customerId}</p>
                </div>
              </div>

              <div className="overview-section">
                <h4>Selected Service Templates</h4>
                <div className="info-card">
                  <table className="jobs-table">
                    <thead>
                      <tr>
                        <th>Template Name</th>
                        <th>Description</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTemplates.map(template => (
                        <tr key={template.id}>
                          <td>{template.name}</td>
                          <td>{template.description || 'N/A'}</td>
                          <td>₹{template.cost?.toFixed(2) || '0.00'}</td>
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
              </div>

              {serviceRequestDescription && (
                <div className="overview-section">
                  <h4>Description</h4>
                  <div className="info-card">
                    <p>{serviceRequestDescription}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="wizard-actions">
          {step > 1 && (
            <button type="button" className="btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="btn-primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Service Request'}
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServiceWizard;
