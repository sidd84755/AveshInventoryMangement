// AddStockSection.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Typography,
  Autocomplete,
} from '@mui/material';

const AddStock = ({ products, fetchProducts, showAlert }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
  });
  const [currentStock, setCurrentStock] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Log just the products array to verify
  useEffect(() => {
    console.log('Products:', products); // Should log an array of products
  }, [products]);

  // When a product is selected, update the formData and current stock.
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({ ...prev, productId: selectedProduct._id }));
      setCurrentStock(selectedProduct.stock);
    } else {
      setFormData((prev) => ({ ...prev, productId: '' }));
      setCurrentStock(null);
    }
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/products/${formData.productId}/addStock`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: parseInt(formData.quantity, 10),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add stock');
      }

      products.fetchProducts();
      products.showAlert('Stock added successfully!', 'success');
      setFormData({ productId: '', quantity: '' });
      setSelectedProduct(null);
      setCurrentStock(null);
    } catch (err) {
        products.showAlert(err.message, 'danger');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4, px: 2 }}>
      <Card>
        <CardHeader
          title={
            <Typography
              variant="h6"
              component="div"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <span role="img" aria-label="stock" style={{ marginRight: 8 }}>
                📦
              </span>
              Add Stock
            </Typography>
          }
          sx={{
            backgroundColor: 'primary.dark',
            color: 'primary.contrastText',
            px: 2,
            py: 1,
          }}
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* Searchable Product Autocomplete */}
            <Autocomplete
              openOnFocus
              options={Array.isArray(products.products) ? products.products : []}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={selectedProduct || null}
              onChange={(e, newValue) => setSelectedProduct(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Product"
                  variant="outlined"
                  margin="normal"
                  required
                />
              )}
            />
            {currentStock !== null && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Current Stock: {currentStock}
              </Typography>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Quantity to Add"
              type="number"
              inputProps={{ min: 1 }}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Add Stock
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddStock;
