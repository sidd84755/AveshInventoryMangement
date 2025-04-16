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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RecordSale = ({ products, fetchProducts, fetchSales, showAlert }) => {
  // State for the customer's name and multiple sale items.
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
  const [saleItems, setSaleItems] = useState([
    {
      product: null,
      quantity: '',
      salePrice: '',
      currentStock: null,
      salePriceCalcEnabled: false,
      directSalePriceCalcEnabled: false, // <-- New flag
      discountPercentage: 45, // default discount percentage (in %)
      company: '',
    },
  ]);

  // Helper function to compute Sale Price based on the product's price and discount percentage.
  const computeSalePrice = (item) => {
    if (!item.product || !item.discountPercentage) return '';
    const price = parseFloat(item.product.price);
    const discount = parseFloat(item.discountPercentage);
    if (!price || isNaN(discount)) return '';
    // Calculation: (price - (price * discount/100)) / 1.18
    const tempValue = price - (price * discount) / 100;
    const tempSalePrice = tempValue / 1.18;
    return tempSalePrice.toFixed(2);
  };

  // Helper function to compute the new discount percentage from the computed sale price.
  const computeNewDiscount = (item) => {
    if (!item.product) return '';
    const price = parseFloat(item.product.price);
    const computedSalePrice = parseFloat(computeSalePrice(item));
    if (!price || !computedSalePrice) return '';
    // Calculation: |((computedSalePrice / price) * 100) - 100|
    const newDiscount = Math.abs(((computedSalePrice / price) * 100) - 100);
    return newDiscount.toFixed(2);
  };

  // NEW helper function to compute direct sale price from the product's price
  // by applying a percentage directly, e.g. price * (percentage / 100).
  const computeDirectSalePrice = (item) => {
    if (!item.product || !item.discountPercentage) return '';
    const price = parseFloat(item.product.price);
    const discount = parseFloat(item.discountPercentage);
    if (!price || isNaN(discount)) return '';
    // Calculation: direct sale price = price * (discountPercentage / 100)
    const directSale1 = price * (discount / 100);
    const directSale = price - directSale1;
    return directSale.toFixed(2);
  };

  // Update a sale item field.
  const updateSaleItem = (index, field, value) => {
    setSaleItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return newItems;
    });
  };

  // When a product is selected, update the product, its current stock, and company.
  const handleProductChange = (index, newProduct) => {
    setSaleItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index].product = newProduct;
      newItems[index].currentStock = newProduct ? newProduct.stock : null;
      newItems[index].company = newProduct ? newProduct.company : '';
      return newItems;
    });
  };

  // Add a new sale item row.
  const addSaleItem = () => {
    setSaleItems((prevItems) => [
      ...prevItems,
      {
        product: null,
        quantity: '',
        salePrice: '',
        currentStock: null,
        salePriceCalcEnabled: false,
        directSalePriceCalcEnabled: false, // <-- New flag
        discountPercentage: 45,
        company: '',
      },
    ]);
  };

  // Remove a sale item row.
  const removeSaleItem = (index) => {
    setSaleItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Submit handler.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations.
    if (!customerName.trim()) {
      showAlert('Customer name is required.', 'danger');
      return;
    }
    if (!customerAddress.trim()) {
      showAlert('Customer address is required.', 'danger');
      return;
    }
    if (!customerPhoneNumber.trim()) {
      showAlert('Customer phone number is required.', 'danger');
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
      // Validate computed sale price if a calculation method is enabled.
      if (
        (item.salePriceCalcEnabled || item.directSalePriceCalcEnabled) &&
        (!item.product.price ||
          (item.salePriceCalcEnabled && computeSalePrice(item) === '') ||
          (item.directSalePriceCalcEnabled && computeDirectSalePrice(item) === ''))
      ) {
        showAlert(`Sale price could not be computed for item ${i + 1}.`, 'danger');
        return;
      }
      // Otherwise, if manually entered, validate salePrice.
      if (
        !item.salePriceCalcEnabled &&
        !item.directSalePriceCalcEnabled &&
        (!item.salePrice || parseFloat(item.salePrice) < 0)
      ) {
        showAlert(`Valid sale price is required for item ${i + 1}.`, 'danger');
        return;
      }
    }

    // Prepare the sale items for the backend.
    const items = saleItems.map((item) => {
      const computedSalePrice =
        item.salePriceCalcEnabled && item.product
          ? parseFloat(computeSalePrice(item))
          : item.directSalePriceCalcEnabled && item.product
          ? parseFloat(computeDirectSalePrice(item))
          : parseFloat(item.salePrice);
      const newDiscount =
        item.salePriceCalcEnabled && item.product
          ? parseFloat(computeNewDiscount(item))
          : undefined; // If not using calculation, you might omit this field.
      return {
        productId: item.product._id,
        quantity: parseInt(item.quantity, 10),
        salePrice: computedSalePrice,
        company: item.company,
        newDiscountPercentage: newDiscount, // Send new discount percentage to the backend.
      };
    });

    try {
      const res = await fetch('https://aveshinventorymangement.onrender.com/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerAddress,
          customerPhoneNumber,
          items,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to record sale');
      }

      // Refresh products and sales, show success, and reset the form.
      fetchProducts();
      fetchSales();
      showAlert('Sale recorded successfully!', 'success');
      setCustomerName('');
      setCustomerAddress('');
      setCustomerPhoneNumber('');
      setSaleItems([
        {
          product: null,
          quantity: '',
          salePrice: '',
          currentStock: null,
          salePriceCalcEnabled: false,
          directSalePriceCalcEnabled: false,
          discountPercentage: 45,
          company: '',
        },
      ]);
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
            <TextField
              fullWidth
              margin="normal"
              label="Customer Phone Number"
              variant="outlined"
              value={customerPhoneNumber}
              onChange={(e) => setCustomerPhoneNumber(e.target.value)}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Customer Address"
              variant="outlined"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
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
                  getOptionLabel={(option) =>
                    option.description
                      ? `${option.name} - ${option.description}`
                      : option.name
                  }
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mt: 1,
                  }}
                >
                  {item.currentStock !== null && (
                    <Typography variant="caption" color="text.secondary">
                      Current Stock: {item.currentStock}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Company Name: {item.company}
                  </Typography>
                </Box>
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
                {/* Sale Price Calculation Option */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.salePriceCalcEnabled || false}
                      onChange={(e) =>
                        updateSaleItem(index, 'salePriceCalcEnabled', e.target.checked)
                      }
                    />
                  }
                  label="Calculate Sale Price"
                  sx={{ mt: 1 }}
                />
                {/* New Direct Sale Price Calculation Option */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.directSalePriceCalcEnabled || false}
                      onChange={(e) =>
                        updateSaleItem(index, 'directSalePriceCalcEnabled', e.target.checked)
                      }
                    />
                  }
                  label="Calculate Direct Sale Price"
                  sx={{ mt: 1 }}
                />
                {/* Show discount percentage input if any calculation is enabled */}
                {(item.salePriceCalcEnabled || item.directSalePriceCalcEnabled) && (
                  <TextField
                    fullWidth
                    label="Discount Percentage (%)"
                    type="number"
                    value={item.discountPercentage}
                    onChange={(e) =>
                      updateSaleItem(index, 'discountPercentage', e.target.value)
                    }
                    margin="normal"
                  />
                )}
                {/* Show New Discount Percentage only for the original calculated sale price */}
                {item.salePriceCalcEnabled && (
                  <TextField
                    fullWidth
                    label="New Discount Percentage"
                    value={computeNewDiscount(item)}
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Sale Price"
                  type="number"
                  inputProps={{ min: 0, step: '0.01' }}
                  value={
                    item.salePriceCalcEnabled && item.product
                      ? computeSalePrice(item)
                      : item.directSalePriceCalcEnabled && item.product
                      ? computeDirectSalePrice(item)
                      : item.salePrice
                  }
                  onChange={(e) => updateSaleItem(index, 'salePrice', e.target.value)}
                  required
                  InputProps={
                    (item.salePriceCalcEnabled || item.directSalePriceCalcEnabled)
                      ? { readOnly: true }
                      : {}
                  }
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
