// SaleReceipt.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const SaleReceipt = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const receiptRef = useRef();

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`/api/sales/${id}`); // Ensure this endpoint is implemented in your backend.
        if (!response.ok) {
          throw new Error('Sale not found');
        }
        const data = await response.json();
        setSale(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSale();
  }, [id]);

  const downloadPDF = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`receipt_${sale._id}.pdf`);
  };

  if (!sale) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', my: 4, p: 2 }} ref={receiptRef}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          Receipt
        </Typography>
        <Typography variant="subtitle1">Customer: {sale.customerName}</Typography>
        <Typography variant="subtitle2">
          Date: {new Date(sale.saleDate).toLocaleString()}
        </Typography>
        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Product</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Quantity</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Cost Price</th>
              <th style={{ border: '1px solid #000', padding: '8px' }}>Sale Price</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #000', padding: '8px' }}>
                  {item.product?.name || 'Deleted Product'}
                </td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>{item.quantity}</td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>
                  ₹{(item.product?.price || 0).toFixed(2)}
                </td>
                <td style={{ border: '1px solid #000', padding: '8px' }}>
                  ₹{item.salePrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button variant="contained" onClick={downloadPDF} sx={{ mt: 2 }}>
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default SaleReceipt;
