import React, { useState, useEffect } from 'react';
import { customerAPI } from '../../services/api';
import CustomerForm from './CustomerForm';
import './Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCustomer(null);
    loadCustomers();
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner"></i>
        Loading customers...
      </div>
    );
  }

  return (
    <div className="customers">
      <div className="page-header">
        <h1>
          <i className="fas fa-users"></i>
          Customers
        </h1>
        <button className="btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Add Customer
        </button>
      </div>

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onClose={handleFormClose}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Vehicles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <i className="fas fa-inbox"></i>
                  No customers found. Create your first customer!
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.fullName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.vehicles?.length || 0}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(customer)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(customer.id)}
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

export default Customers;

