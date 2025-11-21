import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/common.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
  // React.StrictMode disabled to prevent duplicate API calls in development
  // Uncomment if needed: <React.StrictMode><App /></React.StrictMode>
);

