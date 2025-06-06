import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Grid,
  InputAdornment,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const AddProduct = ({ fetchProducts, showAlert }) => {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    description: '',
    price: '',
    costPrice: '',
    stock: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://aveshhomemangement.onrender.com/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // fallback to 0 if empty or invalid
          price: parseFloat(formData.price) || 0,
          costPrice: parseFloat(formData.costPrice) || 0,
          stock: parseInt(formData.stock, 10) || 0,
        }),
      });

      if (!res.ok) throw new Error('Failed to add product');

      fetchProducts();
      showAlert('Product added successfully!', 'success');
      setFormData({
        company: '',
        name: '',
        description: '',
        price: '',
        costPrice: '',
        stock: '',
      });
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
                📦
              </span>
              Add New Product
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
            <TextField
              fullWidth
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price/M.R.P"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  margin="normal"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
                <TextField
                  fullWidth
                  label="Cost Price"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Initial Stock"
                  type="number"
                  inputProps={{ min: '0' }}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              Add Product
            </Button>
            <Button
              component={Link}
              to="/bulk-upload"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            >
              Bulk Upload
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddProduct;
