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

const AddProduct = ({ fetchProducts, showAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://aveshinventorymangement.onrender.com/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
        }),
      });

      if (!res.ok) throw new Error('Failed to add product');

      fetchProducts();
      showAlert('Product added successfully!', 'success');
      setFormData({
        name: '',
        description: '',
        price: '',
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
              label="Product Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
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
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Add Product
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddProduct;
