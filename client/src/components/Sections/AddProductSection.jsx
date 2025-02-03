import React from 'react';
import { Col } from 'react-bootstrap';
import AddProduct from '../AddProduct';

const AddProductSection = ({ fetchProducts, showAlert }) => (
  <Col md={6}>
    <h4>Add New Product</h4>
    <AddProduct fetchProducts={fetchProducts} showAlert={showAlert} />
  </Col>
);

export default AddProductSection;