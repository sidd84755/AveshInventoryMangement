import React, { useState, useEffect, useMemo } from 'react';
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

const MobileProduct = ({ products = [], fetchProducts, showAlert }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const productOptions = useMemo(() => products, [products]);

  useEffect(() => {
    if (selectedProduct) {
      setPrice(selectedProduct.price.toString());
      setStock(selectedProduct.stock.toString());
    } else {
      setPrice('');
      setStock('');
    }
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !category || !imageUrl) {
      showAlert('Please fill all required fields', 'danger');
      return;
    }

    try {
      const res = await fetch(
        'https://aveshinventorymangement.onrender.com/api/mobile',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: selectedProduct._id,
            category,
            price: Number(price),
            stock: Number(stock),
            image: imageUrl,
          }),
        }
      );
      if (!res.ok) throw new Error('Submission failed');

      // reset form
      setSelectedProduct(null);
      setCategory('');
      setPrice('');
      setStock('');
      setImageUrl('');
      fetchProducts?.();
      showAlert('Product saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Submission error', 'danger');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      <Card>
        <CardHeader
          title="Mobile Product Manager"
          sx={{ bgcolor: 'primary.main', color: 'white' }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Autocomplete
              options={productOptions}
              getOptionLabel={(opt) => opt.name}
              isOptionEqualToValue={(a, b) => a._id === b._id}
              value={selectedProduct}
              onChange={(_, val) => setSelectedProduct(val)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Product"
                  margin="normal"
                  required
                  fullWidth
                />
              )}
            />

            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              margin="normal"
              required
              fullWidth
            />

            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              margin="normal"
              required
              fullWidth
            />

            <TextField
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              margin="normal"
              required
              fullWidth
            />

            <TextField
              label="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              margin="normal"
              required
              fullWidth
              helperText="Paste your image link here"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Save Mobile Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MobileProduct;
