import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AddProduct = ({ fetchProducts, showAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      });

      if (!res.ok) throw new Error('Failed to add product');
      
      fetchProducts();
      showAlert('Product added successfully!', 'success');
      setFormData({ 
        name: '', 
        description: '', 
        price: '', 
        stock: '' 
      });
    } catch (err) {
      showAlert(err.message, 'danger');
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">📦 Add New Product</h5>
      </div>
      <div className="card-body">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Initial Stock</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </Form.Group>
            </div>
          </div>

          <Button variant="primary" type="submit" className="w-100">
            Add Product
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddProduct;