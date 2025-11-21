import React, { useState, useEffect, useRef, useMemo } from 'react';
import { customerAPI, vehicleAPI, invoiceAPI, serviceRequestAPI, userAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    vehicles: 0,
    invoices: 0,
    serviceRequests: 0,
  });
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Prevent multiple loads - check both flags
    if (hasLoadedRef.current || isLoadingRef.current) {
      return;
    }

    // Mark as loading and loaded immediately
    hasLoadedRef.current = true;
    isLoadingRef.current = true;
    mountedRef.current = true;
    
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Use Promise.allSettled to handle all requests independently
        const results = await Promise.allSettled([
          customerAPI.getAll(),
          vehicleAPI.getAll(),
          invoiceAPI.getAll(),
          serviceRequestAPI.getAll(),
          userAPI.getAll(),
        ]);

        if (!mountedRef.current) {
          isLoadingRef.current = false;
          return;
        }

        const customers = results[0].status === 'fulfilled' ? results[0].value : { data: [] };
        const vehiclesRes = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
        const invoices = results[2].status === 'fulfilled' ? results[2].value : { data: [] };
        const serviceRequests = results[3].status === 'fulfilled' ? results[3].value : { data: [] };
        const usersRes = results[4].status === 'fulfilled' ? results[4].value : { data: [] };

        if (!mountedRef.current) {
          isLoadingRef.current = false;
          return;
        }

        setStats({
          customers: customers?.data?.length || 0,
          vehicles: vehiclesRes?.data?.length || 0,
          invoices: invoices?.data?.length || 0,
          serviceRequests: serviceRequests?.data?.length || 0,
        });
        setUsers(usersRes?.data || []);
        setVehicles(vehiclesRes?.data || []);
      } catch (error) {
        if (!mountedRef.current) {
          isLoadingRef.current = false;
          return;
        }
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please refresh the page.');
        setStats({
          customers: 0,
          vehicles: 0,
          invoices: 0,
          serviceRequests: 0,
        });
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
        isLoadingRef.current = false;
      }
    };

    loadDashboardData();

    // Cleanup function
    return () => {
      mountedRef.current = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Memoize calculations to prevent unnecessary re-renders
  const vehicleTypes = useMemo(() => {
    return vehicles.reduce((acc, vehicle) => {
      const type = vehicle.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }, [vehicles]);

  const topVehicles = useMemo(() => {
    return vehicles
      .filter(v => v.customerName)
      .slice(0, 5);
  }, [vehicles]);


  if (loading) {
    return (
      <div className="dashboard-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          <i className="fas fa-refresh"></i>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>
        <i className="fas fa-tachometer-alt"></i>
        Dashboard
      </h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.customers}</h3>
            <p>Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-car"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.vehicles}</h3>
            <p>Vehicles</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.serviceRequests}</h3>
            <p>Service Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-file-invoice"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.invoices}</h3>
            <p>Invoices</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>
            <i className="fas fa-users"></i>
            Available Users
          </h2>
          <div className="section-content">
            {users.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                No users found
              </div>
            ) : (
              <div className="users-list">
                {users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="user-details">
                      <strong>{user.fullName || user.username}</strong>
                      <span>ID: {user.id}</span>
                      <span>{user.email}</span>
                      <span className="user-role">{user.role || 'USER'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>
            <i className="fas fa-chart-bar"></i>
            Vehicle Analysis
          </h2>
          <div className="section-content">
            <div className="analysis-card">
              <h3>Vehicle Types Distribution</h3>
              <div className="type-distribution">
                {Object.keys(vehicleTypes).length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-inbox"></i>
                    No vehicle data
                  </div>
                ) : (
                  Object.entries(vehicleTypes).map(([type, count]) => (
                    <div key={type} className="type-item">
                      <div className="type-bar">
                        <div 
                          className="type-fill" 
                          style={{ width: `${(count / stats.vehicles) * 100}%` }}
                        ></div>
                      </div>
                      <div className="type-info">
                        <span className="type-name">{type}</span>
                        <span className="type-count">{count}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="analysis-card">
              <h3>Recent Vehicles</h3>
              <div className="vehicles-list">
                {topVehicles.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-inbox"></i>
                    No vehicles found
                  </div>
                ) : (
                  topVehicles.map(vehicle => (
                    <div key={vehicle.id} className="vehicle-item">
                      <div className="vehicle-icon">
                        <i className="fas fa-car"></i>
                      </div>
                      <div className="vehicle-info">
                        <strong>#{vehicle.number} (ID: {vehicle.id})</strong>
                        <span>Customer: {vehicle.customerName} (ID: {vehicle.customerId})</span>
                        <span>{vehicle.model || 'N/A'} | {vehicle.type || 'N/A'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
