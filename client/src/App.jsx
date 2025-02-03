import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import AppNavbar from './components/Navbar';
import Login from './components/Login';
import AddProductSection from './components/Sections/AddProductSection';
import RecordSaleSection from './components/Sections/RecordSaleSection';
import InventorySection from './components/Sections/InventorySection';
import SalesSection from './components/Sections/SalesSection';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  // Environment variables with fallback values
  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  // Validate authentication on initial load
  const validateAuth = () => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      showAlert('Error fetching products', 'danger');
    }
  };

  // Fetch sales
  const fetchSales = async () => {
    try {
      const res = await fetch('/api/sales');
      const data = await res.json();
      setSales(data);
    } catch (err) {
      showAlert('Error fetching sales', 'danger');
    }
  };

  useEffect(() => {
    setIsAuthenticated(validateAuth());
    if (isAuthenticated) {
      fetchProducts();
      fetchSales();
    }
  }, [isAuthenticated]);

  const ProtectedLayout = () => (
    <>
      <AppNavbar onLogout={handleLogout} />
      <Container className="mt-4">
        {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route
            path="/add-product"
            element={<AddProductSection fetchProducts={fetchProducts} showAlert={showAlert} />}
          />
          <Route
            path="/record-sale"
            element={
              <RecordSaleSection
                products={products}
                fetchProducts={fetchProducts}
                fetchSales={fetchSales}
                showAlert={showAlert}
              />
            }
          />
          <Route
            path="/inventory"
            element={
              <InventorySection
                products={products}
                fetchProducts={fetchProducts}
                showAlert={showAlert}
              />
            }
          />
          <Route
            path="/sales"
            element={<SalesSection sales={sales} />}
          />
        </Routes>
      </Container>
    </>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="w-100" style={{ maxWidth: '400px' }}>
                  <Login 
                    onLogin={handleLogin}
                    adminUsername={ADMIN_USERNAME}
                    adminPassword={ADMIN_PASSWORD}
                  />
                </div>
              </Container>
            }
          />
          <Route 
            path="/*" 
            element={
              isAuthenticated ? (
                <ProtectedLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;