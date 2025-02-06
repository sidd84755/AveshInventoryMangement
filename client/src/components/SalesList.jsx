// SalesList.jsx
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
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
} from '@mui/material';

const SalesList = ({ sales }) => {
  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  let newtest = console.log(sales);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Format the date
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

  // Filter sales based on search query (case-insensitive)
  const filteredSales = useMemo(() => {
    return sales.filter((sale) =>
      (sale.product?.name || 'Deleted Product')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [sales, searchQuery]);

  // Paginate filtered sales
  const paginatedSales = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredSales.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredSales, page, rowsPerPage]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Reset page when search query changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
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
            backgroundColor: 'secondary.main',
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cost Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Cost</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sale Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSales.length > 0 ? (
                  paginatedSales.map((sale) => {
                    const costPrice = sale.product?.price || 0;
                    const totalCost = sale.quantity * costPrice;
                    const salePrice = sale.salePrice || 0;
                    const totalSale = sale.quantity * salePrice;
                    return (
                      <TableRow key={sale._id}>
                        <TableCell>
                          {sale.product?.name || 'Deleted Product'}
                        </TableCell>
                        <TableCell>
                          {sale.product?.description}
                        </TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>₹{costPrice.toFixed(2)}</TableCell>
                        <TableCell>₹{totalCost.toFixed(2)}</TableCell>
                        <TableCell>₹{salePrice.toFixed(2)}</TableCell>
                        <TableCell>₹{totalSale.toFixed(2)}</TableCell>
                        <TableCell>{formatDate(sale.saleDate)}</TableCell>
                      </TableRow>
                    );
                  })
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