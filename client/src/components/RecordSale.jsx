import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecordSale = ({ products, fetchProducts, fetchSales, showAlert }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: ''
  });
  const [currentStock, setCurrentStock] = useState(null);

  useEffect(() => {
    if (formData.productId) {
      const selectedProduct = products.find(p => p._id === formData.productId);
      setCurrentStock(selectedProduct?.stock || 0);
    }
  }, [formData.productId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: formData.productId,
          quantity: parseInt(formData.quantity)
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to record sale');
      }

      fetchProducts();
      fetchSales();
      showAlert('Sale recorded successfully!', 'success');
      setFormData({ productId: '', quantity: '' });
      setCurrentStock(null);
    } catch (err) {
      showAlert(err.message, 'danger');
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">💰 Record Sale</h5>
      </div>
      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Product</Form.Label>
            <Form.Select 
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              required
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </Form.Select>
            {currentStock !== null && (
              <div className="text-muted small mt-1">
                Current Stock: {currentStock}
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Record Sale
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default RecordSale;