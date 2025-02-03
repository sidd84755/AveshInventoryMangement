import React from 'react';
import InventoryList from '../InventoryList';

const InventorySection = ({ products, fetchProducts, showAlert }) => (
  <div className="mt-4">
    <h4 style={{textAlign:'center'}}>Current Inventory</h4>
    <InventoryList
      products={products}
      fetchProducts={fetchProducts}
      showAlert={showAlert}
    />
  </div>
);

export default InventorySection;