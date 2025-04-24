// SalesList.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Card, CardHeader, CardContent, TableContainer, Table, TableHead,
  TableBody, TableRow, TableCell, Paper, Typography, TextField,
  TablePagination, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const navigate = useNavigate();

  const fetchSales = async () => {
    const { data } = await axios.get('https://aveshinventorymangement.onrender.com/api/sales');
    setSales(data);
  };
  useEffect(() => { fetchSales(); }, []);

  const aggregatedSales = useMemo(() =>
    sales.map(sale => {
      const totalQuantity = sale.items.reduce((a, i) => a + i.quantity, 0);
      const totalSale = sale.items.reduce((a, i) => a + i.quantity * i.salePrice, 0);
      return { ...sale, totalQuantity, totalSale };
    }),
  [sales]);

  const filteredSales = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return aggregatedSales.filter(sale =>
      sale.customerName.toLowerCase().includes(q) ||
      sale.items.map(i => i.product?.name || '').join(' ').toLowerCase().includes(q)
    );
  }, [aggregatedSales, searchQuery]);

  const paginatedSales = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSales.slice(start, start + rowsPerPage);
  }, [filteredSales, page]);

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleSearchChange = e => { setSearchQuery(e.target.value); setPage(0); };
  const handleOpenEdit = sale => { setCurrentSale(JSON.parse(JSON.stringify(sale))); setOpenEdit(true); };
  const handleCloseEdit = () => { setOpenEdit(false); setCurrentSale(null); };
  const handleFieldChange = (field, value) => { setCurrentSale({ ...currentSale, [field]: value }); };
  const handleChangeItem = (idx, field, value) => {
    const items = [...currentSale.items];
    items[idx][field] = Number(value);
    setCurrentSale({ ...currentSale, items });
  };
  const handleSave = async () => {
    try { await axios.put(`https://aveshinventorymangement.onrender.com/api/sales/${currentSale._id}`, currentSale); handleCloseEdit(); fetchSales(); }
    catch { alert('Failed to update sale'); }
  };
  const handleDelete = async sale => {
    if (!window.confirm('Delete this sale? This will restock all items.')) return;
    try { await axios.delete(`https://aveshinventorymangement.onrender.com/api/sales/${sale._id}`); fetchSales(); }
    catch { alert('Failed to delete sale'); }
  };
  const formatDate = d => new Date(d).toLocaleString();

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 1200, px: 2 }}>
      <Card>
        <CardHeader title={<Typography variant="h6">📜 Recent Sales</Typography>}
          sx={{ backgroundColor: 'primary.dark', color: 'secondary.contrastText' }} />
        <CardContent>
          <TextField fullWidth label="Search Sales" value={searchQuery}
            onChange={handleSearchChange} sx={{ mb: 2 }} />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Details</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Qty</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Sale</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bill</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>GST Bill</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSales.map(sale => (
                  <TableRow key={sale._id}>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Cost Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>M.R.P</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Sale Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sale.items.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{item.product?.name || 'Deleted Product'}</TableCell>
                              <TableCell>{item.company || item.product?.company || 'N/A'}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>₹{(item.product?.costPrice || 0).toFixed(2)}</TableCell>
                              <TableCell>₹{(item.product?.price || 0).toFixed(2)}</TableCell>
                              <TableCell>₹{item.salePrice.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                    <TableCell>{sale.totalQuantity}</TableCell>
                    <TableCell>₹{sale.totalSale.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(sale.saleDate)}</TableCell>
                    <TableCell><Button onClick={() => navigate(`/receiptBill/${sale._id}`)}>View</Button></TableCell>
                    <TableCell><Button onClick={() => navigate(`/receipt/${sale._id}`)}>View</Button></TableCell>
                    <TableCell>
                      <Button variant="outlined" onClick={() => handleOpenEdit(sale)}>Edit</Button>
                      <Button color="error"  onClick={() => handleDelete(sale)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination component="div" count={filteredSales.length}
            page={page} onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage} rowsPerPageOptions={[rowsPerPage]} />
        </CardContent>
      </Card>

      {currentSale && (
        <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="md">
          <DialogTitle>Edit Sale<IconButton onClick={handleCloseEdit} sx={{position:'absolute', right:8, top:8}}><CloseIcon/></IconButton></DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mb:2 }}>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Customer Name" value={currentSale.customerName} onChange={e=>handleFieldChange('customerName', e.target.value)}/></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Customer Address" value={currentSale.customerAddress} onChange={e=>handleFieldChange('customerAddress', e.target.value)}/></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Customer Phone" type="tel" value={currentSale.customerPhoneNumber} onChange={e=>handleFieldChange('customerPhoneNumber', e.target.value)}/></Grid>
            </Grid>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Qty</TableCell><TableCell>Sale Price</TableCell></TableRow></TableHead>
                <TableBody>
                  {currentSale.items.map((item, idx) => (
                    <TableRow key={idx}><TableCell>{item.product.name}</TableCell><TableCell><TextField type="number" value={item.quantity} onChange={e=>handleChangeItem(idx,'quantity',e.target.value)} inputProps={{min:0}}/></TableCell><TableCell><TextField type="number" value={item.salePrice} onChange={e=>handleChangeItem(idx,'salePrice',e.target.value)} inputProps={{min:0, step:0.01}}/></TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions><Button onClick={handleCloseEdit}>Cancel</Button><Button variant="contained" onClick={handleSave}>Save Changes</Button></DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
export default SalesList;