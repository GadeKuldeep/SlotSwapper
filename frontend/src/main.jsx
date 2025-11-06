import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
  <App />
  {/* Disable draggable to avoid passive event listener preventDefault warnings on touch devices */}
  <ToastContainer draggable={false} />
    </AuthProvider>
  </React.StrictMode>
);