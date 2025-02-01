import React from 'react';
import { Table, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const InventoryList = ({ products, fetchProducts, showAlert }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete product');
        fetchProducts();
        showAlert('Product deleted successfully!', 'success');
      } catch (err) {
        showAlert(err.message, 'danger');
      }
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header bg-dark text-white">
        <h5 className="mb-0">📋 Current Inventory</h5>
      </div>
      <div className="card-body">
        <Table hover responsive>
          <thead>
            <tr>
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={product.stock < 10 ? 'text-danger fw-bold' : 'text-success'}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InventoryList;