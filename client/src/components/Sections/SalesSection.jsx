import React from 'react';
import SalesList from '../SalesList';

const SalesSection = ({ sales }) => (
  <div className="mt-4">
    <h4>Recent Sales</h4>
    <SalesList sales={sales} />
  </div>
);

export default SalesSection;