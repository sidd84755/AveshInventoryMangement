import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Box, Card, CardHeader, CardContent, Button, Typography
} from '@mui/material';

const BulkUpload = ({ fetchProducts, showAlert }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return showAlert('Please select a CSV file', 'warning');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async results => {
        const rows = results.data;
        try {
          // fire all requests in parallel
          await Promise.all(rows.map(row =>
            fetch('https://aveshhomemangement.onrender.com/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                company: row.company,
                name: row.name,
                description: row.description || '',
                price: parseFloat(row.price),
                costPrice: parseFloat(row.costPrice),
                stock: parseInt(row.stock, 10),
              }),
            })
          ));
          showAlert(`Uploaded ${rows.length} products!`, 'success');
          fetchProducts();
        } catch (err) {
          console.error(err);
          showAlert('Error uploading products', 'danger');
        }
      },
      error: err => {
        console.error(err);
        showAlert('Failed to parse CSV', 'danger');
      }
    });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4, px: 2 }}>
      <Card>
        <CardHeader
          title={
            <Typography variant="h6">
              📑 Bulk Upload Products
            </Typography>
          }
          sx={{ backgroundColor: 'primary.dark', color: 'primary.contrastText', px: 2, py: 1 }}
        />
        <CardContent>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginBottom: 16 }}
          />
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file}
            fullWidth
          >
            Upload CSV
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BulkUpload;
