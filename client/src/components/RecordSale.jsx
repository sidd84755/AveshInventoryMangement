// RecordSale.jsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Typography,
  Autocomplete,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RecordSale = ({ products, fetchProducts, fetchSales, showAlert }) => {
  // State for the customer's name and multiple sale items.
  const [customerName, setCustomerName] = useState('');
  const [saleItems, setSaleItems] = useState([
    { product: null, quantity: '', salePrice: '', currentStock: null },
  ]);

  // Update a sale item field
  const updateSaleItem = (index, field, value) => {
    setSaleItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  // When a product is selected update the product and its current stock.
  const handleProductChange = (index, newProduct) => {
    setSaleItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index].product = newProduct;
      newItems[index].currentStock = newProduct ? newProduct.stock : null;
      return newItems;
    });
  };

  // Add a new sale item row.
  const addSaleItem = () => {
    setSaleItems(prevItems => [
      ...prevItems,
      { product: null, quantity: '', salePrice: '', currentStock: null },
    ]);
  };

  // Remove a sale item row.
  const removeSaleItem = (index) => {
    setSaleItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations.
    if (!customerName.trim()) {
      showAlert('Customer name is required.', 'danger');
      return;
    }
    for (let i = 0; i < saleItems.length; i++) {
      const item = saleItems[i];
      if (!item.product) {
        showAlert(`Product selection is required for item ${i + 1}.`, 'danger');
        return;
      }
      if (!item.quantity || parseInt(item.quantity, 10) <= 0) {
        showAlert(`Valid quantity is required for item ${i + 1}.`, 'danger');
        return;
      }
      if (!item.salePrice || parseFloat(item.salePrice) < 0) {
        showAlert(`Valid sale price is required for item ${i + 1}.`, 'danger');
        return;
      }
    }

    // Prepare the sale items for the backend.
    const items = saleItems.map(item => ({
      productId: item.product._id,
      quantity: parseInt(item.quantity, 10),
      salePrice: parseFloat(item.salePrice)
    }));

    try {
      const res = await fetch('https://aveshinventorymangement.onrender.com/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          items,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to record sale');
      }

      // Refresh the products and sales, show success, and reset the form.
      fetchProducts();
      fetchSales();
      showAlert('Sale recorded successfully!', 'success');
      setCustomerName('');
      setSaleItems([{ product: null, quantity: '', salePrice: '', currentStock: null }]);
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
            {/* Customer Name Field */}
            <TextField
              fullWidth
              margin="normal"
              label="Customer Name"
              variant="outlined"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            {/* Render each sale item */}
            {saleItems.map((item, index) => (
              <Box
                key={index}
                sx={{
                  border: '1px solid #ccc',
                  p: 2,
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Item {index + 1}</Typography>
                  {saleItems.length > 1 && (
                    <IconButton color="error" onClick={() => removeSaleItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                {/* Product Autocomplete */}
                <Autocomplete
                  options={products}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  value={item.product || null}
                  onChange={(e, newValue) => handleProductChange(index, newValue)}
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
                {item.currentStock !== null && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Current Stock: {item.currentStock}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Quantity"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={item.quantity}
                  onChange={(e) => updateSaleItem(index, 'quantity', e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Sale Price"
                  type="number"
                  inputProps={{ min: 0, step: '0.01' }}
                  value={item.salePrice}
                  onChange={(e) => updateSaleItem(index, 'salePrice', e.target.value)}
                  required
                />
              </Box>
            ))}
            <Button variant="outlined" onClick={addSaleItem} sx={{ mb: 2 }}>
              Add Another Product
            </Button>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Record Sale
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecordSale;
