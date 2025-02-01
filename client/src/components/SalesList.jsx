import React from 'react';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SalesList = ({ sales }) => {
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card mt-4">
      <div className="card-header bg-secondary text-white">
        <h5 className="mb-0">📜 Recent Sales</h5>
      </div>
      <div className="card-body">
        <Table hover responsive>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale._id}>
                <td>{sale.product?.name || 'Deleted Product'}</td>
                <td>{sale.quantity}</td>
                <td>{formatDate(sale.saleDate)}</td>
                <td>${(sale.quantity * (sale.product?.price || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default SalesList;