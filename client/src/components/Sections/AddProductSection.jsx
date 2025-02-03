import React from 'react';
import { Col } from 'react-bootstrap';
import AddProduct from '../AddProduct';

const AddProductSection = ({ fetchProducts, showAlert }) => (
  <div className="mt-4">
      <h4 style={{textAlign:'center'}}>Add New Product</h4>
      <AddProduct fetchProducts={fetchProducts} showAlert={showAlert} />
  </div>
);

export default AddProductSection;