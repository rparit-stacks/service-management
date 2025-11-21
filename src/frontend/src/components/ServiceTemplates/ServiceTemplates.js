import React, { useState, useEffect } from 'react';
import { serviceTemplateAPI } from '../../services/api';
import ServiceTemplateForm from './ServiceTemplateForm';
import './ServiceTemplates.css';

const ServiceTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await serviceTemplateAPI.getAll();
      setTemplates(response.data);
    } catch (error) {
      console.error('Error loading service templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setShowForm(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service template?')) {
      try {
        await serviceTemplateAPI.delete(id);
        loadTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        alert('Failed to delete service template');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTemplate(null);
    loadTemplates();
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner"></i>
        Loading service templates...
      </div>
    );
  }

  return (
    <div className="service-templates">
      <div className="page-header">
        <h1>
          <i className="fas fa-list-alt"></i>
          Service Templates (Master List)
        </h1>
        <button className="btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Add Service Template
        </button>
      </div>

      <div className="info-banner">
        <i className="fas fa-info-circle"></i>
        <p>
          Manage your master list of services here. These templates are used when creating service requests.
          You can add new services (like parts replacement, oiling, etc.) to expand your offerings.
        </p>
      </div>

      {showForm && (
        <ServiceTemplateForm
          template={editingTemplate}
          onClose={handleFormClose}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>Description</th>
              <th>Default Cost (₹)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <i className="fas fa-inbox"></i>
                  No service templates found. Create your first template!
                </td>
              </tr>
            ) : (
              templates.map((template) => (
                <tr key={template.id}>
                  <td>
                    <strong>{template.id}</strong>
                  </td>
                  <td>{template.name}</td>
                  <td>{template.description || 'N/A'}</td>
                  <td>₹{template.defaultCost?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge ${template.active ? 'active' : 'inactive'}`}>
                      {template.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(template)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(template.id)}
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceTemplates;

