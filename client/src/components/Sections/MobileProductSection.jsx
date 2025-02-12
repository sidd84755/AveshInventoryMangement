import React from 'react';
import MobileProduct from '../MobileProduct';

const MobileProductSection = ({ products, fetchProducts, showAlert }) => (
  <div className="mt-4">
      <h4 style={{textAlign:'center'}}>Add New Product</h4>
      <MobileProduct products={products} fetchProducts={fetchProducts} showAlert={showAlert} />
  </div>
);

export default MobileProductSection;