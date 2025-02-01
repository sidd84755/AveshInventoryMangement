import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import AddProduct from './components/AddProduct.jsx';
import RecordSale from './components/RecordSale';
import InventoryList from './components/InventoryList';
import SalesList from './components/SalesList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
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
    fetchProducts();
    fetchSales();
  }, []);

  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Inventory Manager</span>
        </div>
      </nav>

      <Container className="mt-4">
        {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

        <Row className="g-4">
          <Col md={6}>
            <AddProduct fetchProducts={fetchProducts} showAlert={showAlert} />
          </Col>
          <Col md={6}>
            <RecordSale 
              products={products} 
              fetchProducts={fetchProducts} 
              fetchSales={fetchSales}
              showAlert={showAlert}
            />
          </Col>
        </Row>

        <InventoryList 
          products={products} 
          fetchProducts={fetchProducts}
          showAlert={showAlert}
        />

        <SalesList sales={sales} />
      </Container>
    </div>
  );
}

export default App;