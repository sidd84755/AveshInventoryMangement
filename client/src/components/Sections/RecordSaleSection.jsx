import React from 'react';
import RecordSale from '../RecordSale';

const RecordSaleSection = ({ products, fetchProducts, fetchSales, showAlert }) => (
  <div className="mt-4">
    <h4 style={{textAlign:'center'}}>Record Sale</h4>
    <RecordSale
      products={products}
      fetchProducts={fetchProducts}
      fetchSales={fetchSales}
      showAlert={showAlert}
    />
  </div>
);

export default RecordSaleSection;