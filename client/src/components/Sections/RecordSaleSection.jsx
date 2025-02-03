import React from 'react';
import { Col } from 'react-bootstrap';
import RecordSale from '../RecordSale';

const RecordSaleSection = ({ products, fetchProducts, fetchSales, showAlert }) => (
  <Col md={6}>
    <h4>Record Sale</h4>
    <RecordSale
      products={products}
      fetchProducts={fetchProducts}
      fetchSales={fetchSales}
      showAlert={showAlert}
    />
  </Col>
);

export default RecordSaleSection;