// RecordSale.jsx
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

const RecordSale = ({ products, fetchProducts, fetchSales, showAlert }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    salePrice: '',
  });
  const [currentStock, setCurrentStock] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: formData.productId,
          quantity: parseInt(formData.quantity, 10),
          salePrice: parseFloat(formData.salePrice),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to record sale');
      }

      fetchProducts();
      fetchSales();
      showAlert('Sale recorded successfully!', 'success');
      setFormData({ productId: '', quantity: '', salePrice: '' });
      setSelectedProduct(null);
      setCurrentStock(null);
    } catch (err) {
      showAlert(err.message, 'danger');
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
              <span role="img" aria-label="inventory" style={{ marginRight: 8 }}>
                💰
              </span>
              Record Sales
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
              options={products}
              getOptionLabel={(option) => option.name}
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
              label="Quantity"
              type="number"
              inputProps={{ min: 1 }}
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
            />

            {/* New Sale Price Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Sale Price"
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              value={formData.salePrice}
              onChange={(e) =>
                setFormData({ ...formData, salePrice: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Record Sale
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecordSale;
