// SalesList.jsx
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  TextField,
  TablePagination,
  Button
} from '@mui/material';

const SalesList = ({ sales }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Compute aggregated totals for each sale.
  const aggregatedSales = useMemo(() => {
    return sales.map(sale => {
      const totalQuantity = sale.items.reduce((acc, item) => acc + item.quantity, 0);
      const totalCost = sale.items.reduce((acc, item) => {
        const costPrice = item.product?.price || 0;
        return acc + item.quantity * costPrice;
      }, 0);
      const totalSale = sale.items.reduce((acc, item) => acc + item.quantity * item.salePrice, 0);

      return {
        ...sale,
        totalQuantity,
        totalCost,
        totalSale
      };
    });
  }, [sales]);

  // Filter sales by searching in the customer name or product names.
  const filteredSales = useMemo(() => {
    return aggregatedSales.filter(sale => {
      const customerStr = (sale.customerName || '').toLowerCase();
      const productsStr = sale.items
        .map(item => item.product?.name || '')
        .join(' ')
        .toLowerCase();
      const query = searchQuery.toLowerCase();
      return customerStr.includes(query) || productsStr.includes(query);
    });
  }, [aggregatedSales, searchQuery]);

  // Apply pagination.
  const paginatedSales = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredSales.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSales, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 1200, px: 2 }}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6" component="div">
              📜 Recent Sales
            </Typography>
          }
          sx={{
            backgroundColor: 'primary.dark',
            color: 'secondary.contrastText',
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
              label="Search Sales"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="sales table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Products</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Cost</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Sale</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSales.length > 0 ? (
                  paginatedSales.map((sale) => (
                    <TableRow key={sale._id}>
                      <TableCell>{sale.customerName || 'Unknown Customer'}</TableCell>
                      <TableCell>
                        {/* Nested table for sale items */}
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Cost Price</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Sale Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sale.items.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{item.product?.name || 'Deleted Product'}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>₹{(item.product?.price || 0).toFixed(2)}</TableCell>
                                <TableCell>₹{item.salePrice.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                      <TableCell>{sale.totalQuantity}</TableCell>
                      <TableCell>₹{sale.totalCost.toFixed(2)}</TableCell>
                      <TableCell>₹{sale.totalSale.toFixed(2)}</TableCell>
                      <TableCell>{formatDate(sale.saleDate)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => navigate(`/receipt/${sale._id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No sales data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredSales.length}
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

SalesList.propTypes = {
  sales: PropTypes.array.isRequired,
};

export default SalesList;
