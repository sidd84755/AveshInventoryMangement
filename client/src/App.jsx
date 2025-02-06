import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import AppNavbar from './components/Navbar';
import Login from './components/Login';
import AddProductSection from './components/Sections/AddProductSection';
import RecordSaleSection from './components/Sections/RecordSaleSection';
import InventorySection from './components/Sections/InventorySection';
import SalesSection from './components/Sections/SalesSection';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import MUI and Toolpad components for the sidebar layout
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import LogoutIcon from '@mui/icons-material/Logout';
import PropTypes from 'prop-types';
import AddStockSection from './components/Sections/AddStockSection';

const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  {
    segment: 'inventory',
    title: 'Inventory',
    icon: <DashboardIcon />,
  },
  {
    segment: 'sales',
    title: 'Sales',
    icon: <TimelineIcon />,
  },
  {
    segment: 'add-product',
    title: 'Add Product',
    icon: <DashboardIcon />,
  },
  {
    segment: 'addStock',
    title: 'Add Stock',
    icon: <DashboardIcon />,
  },
  {
    segment: 'record-sale',
    title: 'Record Sale',
    icon: <TimelineIcon />,
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function LogoutRoute({ onLogout }) {
  useEffect(() => {
    onLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Navigate to="/login" replace />;
}

LogoutRoute.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

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

  // function CustomHeader({ onLogout }) {
  //   return (
  //     <AppBar position="static" color="default" elevation={1}>
  //       <Toolbar>
  //         {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
  //           Inventory Manager
  //         </Typography> */}
  //         <Button color="inherit" onClick={onLogout}>
  //           Logout
  //         </Button>
  //       </Toolbar>
  //     </AppBar>
  //   );
  // }

  // CustomHeader.propTypes = {
  //   onLogout: PropTypes.func.isRequired,
  // };

  const ProtectedLayout = () => (
    <>
    <AppProvider navigation={NAVIGATION} theme={demoTheme} 
    branding={{
    logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
    title: 'Avesh Home Solutions',
  }}>
    <DashboardLayout defaultSidebarCollapsed>
    {/* <CustomHeader onLogout={handleLogout} /> */}
      {/* <AppNavbar onLogout={handleLogout} /> */}
      <Container>
      {alert && (
              <Typography variant="body1" color="error">
                {alert.message}
              </Typography>)}
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route
            path="/add-product"
            element={<AddProductSection fetchProducts={fetchProducts} showAlert={showAlert} />}
          />
            <Route
              path="/addStock"
              element={<AddStockSection products={products} fetchProducts={fetchProducts} fetchSales={fetchSales} showAlert={showAlert} />}
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
            element={<SalesSection sales={sales} fetchSales={fetchSales}/>}
          />
           <Route
                path="/logout"
                element={<LogoutRoute onLogout={handleLogout} />}
            />
        </Routes>
      </Container>
      </DashboardLayout>
      </AppProvider>
    </>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              <Container>
                <div className="">
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