import React, { useState, useEffect } from 'react';
import { invoiceAPI } from '../../services/api';
import InvoiceForm from './InvoiceForm';
import CreateInvoiceWizard from './CreateInvoiceWizard';
import './Invoices.css';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response = await invoiceAPI.getAll();
      setInvoices(response.data);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowWizard(true);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceAPI.delete(id);
        loadInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice');
      }
    }
  };

  const handleDownload = (id) => {
    invoiceAPI.download(id);
  };

  const handlePrint = (id) => {
    invoiceAPI.print(id);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingInvoice(null);
    loadInvoices();
  };

  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner"></i>
        Loading invoices...
      </div>
    );
  }

  return (
    <div className="invoices">
      <div className="page-header">
        <h1>
          <i className="fas fa-file-invoice"></i>
          Invoices
        </h1>
        <button className="btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Create Invoice
        </button>
      </div>

      {showWizard && (
        <CreateInvoiceWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => {
            setShowWizard(false);
            loadInvoices();
          }}
        />
      )}

      {showForm && (
        <InvoiceForm
          invoice={editingInvoice}
          onClose={handleFormClose}
        />
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  <i className="fas fa-inbox"></i>
                  No invoices found. Create your first invoice!
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <strong>{invoice.invoiceNumber}</strong>
                    <br />
                    <small style={{ color: '#757575' }}>ID: {invoice.id}</small>
                  </td>
                  <td>
                    {invoice.customerName}
                    <br />
                    <small style={{ color: '#757575' }}>ID: {invoice.customerId}</small>
                  </td>
                  <td>
                    {invoice.vehicleNumber}
                    <br />
                    <small style={{ color: '#757575' }}>ID: {invoice.vehicleId}</small>
                  </td>
                  <td>₹{invoice.totalAmount?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge ${invoice.paymentStatus?.toLowerCase()}`}>
                      {invoice.paymentStatus}
                    </span>
                  </td>
                  <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => handleDownload(invoice.id)}
                    >
                      <i className="fas fa-download"></i>
                      Download
                    </button>
                    <button
                      className="btn-print"
                      onClick={() => handlePrint(invoice.id)}
                    >
                      <i className="fas fa-print"></i>
                      Print
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(invoice)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(invoice.id)}
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

export default Invoices;

