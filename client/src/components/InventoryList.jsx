// InventoryList.jsx
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TextField,
  TablePagination,
} from '@mui/material';

const InventoryList = ({ products, fetchProducts, showAlert }) => {
  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Handler for delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete product');
        fetchProducts();
        showAlert('Product deleted successfully!', 'success');
      } catch (err) {
        showAlert(err.message, 'danger');
      }
    }
  };

  // Filter products based on search query (case-insensitive)
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProducts, page, rowsPerPage]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Reset page when search query changes to avoid empty pages
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 1000, px: 2 }}>
      <Card>
        <CardHeader
          title={
            <Typography
              variant="h6"
              component="div"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <span role="img" aria-label="inventory" style={{ marginRight: 8 }}>
                📋
              </span>
              Current Inventory
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
          {/* Search Field */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Products"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="inventory table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cost Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => {
                    const totalPrice = product.price * product.stock;
                    return (
                      <TableRow key={product._id}>
                        <TableCell>{product.company}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>₹{product.price.toFixed(2)}</TableCell>
                        <TableCell>₹{product.costPrice}</TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              fontWeight: 'bold',
                              color:
                                product.stock < 10 ? 'error.main' : 'success.main',
                            }}
                          >
                            {product.stock}
                          </Typography>
                        </TableCell>
                        <TableCell>₹{totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No products available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredProducts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

InventoryList.propTypes = {
  products: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
};

export default InventoryList;
