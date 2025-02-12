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
import axios from 'axios';

const MobileProduct = ({ products = [], fetchProducts, showAlert }) => {
  // State management
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Memoize products to prevent unnecessary re-renders
  const productOptions = useMemo(() => products, [products]);

  // Sync form with selected product
  useEffect(() => {
    if (selectedProduct) {
      setPrice(selectedProduct.price.toString());
      setStock(selectedProduct.stock.toString());
    }
  }, [selectedProduct]);

  // Image upload handler
  const handleImageUpload = async (file) => {
    try {
      setIsUploading(true);
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        form
      );
      
      setImageUrl(data.secure_url);
      showAlert('Image uploaded successfully!', 'success');
    } catch (error) {
      showAlert('Image upload failed', 'danger');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct || !category || !imageUrl) {
      showAlert('Please fill all required fields', 'danger');
      return;
    }

    try {
      const response = await fetch('/api/mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct._id,
          category,
          price: Number(price),
          stock: Number(stock),
          image: imageUrl
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      // Reset form while keeping image
      setSelectedProduct(null);
      setCategory('');
      setPrice('');
      setStock('');
      fetchProducts?.();
      
      showAlert('Product saved successfully!', 'success');
    } catch (error) {
      showAlert(error.message || 'Submission error', 'danger');
      console.error('Submission error:', error);
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
            {/* Product Selection */}
            <Autocomplete
              options={productOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(a, b) => a._id === b._id}
              value={selectedProduct}
              onChange={(_, value) => setSelectedProduct(value)}
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

            {/* Category Input */}
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              margin="normal"
              required
              fullWidth
            />

            {/* Price Input */}
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              margin="normal"
              required
              fullWidth
            />

            {/* Stock Input */}
            <TextField
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              margin="normal"
              required
              fullWidth
            />

            {/* Image Upload */}
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
            />
            <label htmlFor="image-upload">
              <Button
                component="span"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Product Image'}
              </Button>
            </label>

            {/* Image Preview */}
            {imageUrl && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={imageUrl}
                  alt="Product preview"
                  style={{ maxWidth: '100%', maxHeight: 200 }}
                />
              </Box>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={isUploading}
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