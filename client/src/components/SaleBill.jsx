import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const SaleBill = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const receiptRef = useRef();

  // Static company information
  const companyInfo = {
    name: "AVESH TRADING COMPANY",
    address: "Plot No. 3, Allu Nagar Diguriya, Near-IIM Chauraha, Lucknow",
    gstin: "09ABNFA6381J12W",
    mobiles: ["9338803280", "8429223683"],
    email: "aveshumar@gmail.com",
    bank: {
      name: "................................",
      branch: "...............................",
      account: "..........................",
      ifsc: "........................"
    }
  };

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`https://aveshhomemangement.onrender.com/api/sales/${id}`); // Ensure this endpoint is implemented in your backend.
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
    // Hide the Download PDF button temporarily
    const downloadBtn = document.getElementById("downloadButton");
    if (downloadBtn) {
      downloadBtn.style.display = 'none';
    }
  
    // Get the receipt element
    const element = receiptRef.current;
    // Optionally remove box-shadow to avoid capturing it
    const originalBoxShadow = element.style.boxShadow;
    element.style.boxShadow = 'none';
  
    // Use html2canvas options to improve consistency
    const canvas = await html2canvas(element, {
      scale: window.devicePixelRatio,  // Adjust scale as needed (e.g., 2)
      scrollY: -window.scrollY,          // Counter any scroll offset
      backgroundColor: '#ffffff'         // Set a consistent background color
    });
    const imgData = canvas.toDataURL('image/png');
    
    // Create a new jsPDF instance (you can adjust the format as needed)
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // Calculate the height based on the canvas ratio
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`receipt_${sale._id}.pdf`);
  
    // Restore the box-shadow and show the button again
    element.style.boxShadow = originalBoxShadow;
    if (downloadBtn) {
      downloadBtn.style.display = 'block';
    }
  };

  if (!sale) return <Typography>Loading...</Typography>;

  // Calculate totals
  // const newDiscountPercentage1 = item.product.price - item.salePrice;
  // const newDiscountPercentage2 = (newDiscountPercentage1 / item.product.price) * 100;
  const totalAmount = sale.items.reduce((sum, item) => sum + (item.quantity * item.salePrice), 0);
  const taxRate = 9; // Example tax rate (update with your actual rate)
  const cgst = (totalAmount * taxRate) / 100;
  const sgst = (totalAmount * taxRate) / 100;
  const grandTotal = totalAmount + cgst + sgst;

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', my: 4, p: 3 }} ref={receiptRef}>
      <CardContent>
        {/* Company Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {/* <Typography variant="body2">
            GSTIN: {companyInfo.gstin}
          </Typography> */}
          <Typography variant="body2">
            Bill/Cash Memo
          </Typography>
          <Typography variant="body2">Mob: {companyInfo.mobiles.join(", ")}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: '900' }}>
            {companyInfo.name}
          </Typography>
          <Typography variant="body2" mt={2} sx={{ fontWeight: '600' }}>
            Authorised Dealer: Tiles, Granite, Sanitary ware & Bath Accessories
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2">
            {companyInfo.address}  <span style={{ fontWeight: '600', marginLeft: '5px' }}>Email: </span> {companyInfo.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Customer Details */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography>Name: {sale.customerName}</Typography>
            <Typography>Phone Number: {sale.customerPhoneNumber}</Typography>
            <Typography>State: {sale.state || "Uttar Pradesh"}</Typography>
            <Typography>GSTIN: {sale.gstin || "N/A"}</Typography>
          </Box>
          <Box>
            <Typography>Cash Memo No: {sale._id}</Typography>
            <Typography>Date: {new Date(sale.saleDate).toLocaleDateString()}</Typography>
            <Typography>Address: {sale.customerAddress}</Typography>
            <Typography>Place of Supply: {sale.placeOfSupply || "Lucknow"}</Typography>
          </Box>
        </Box>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
          <thead>
            <tr>
              {["S.N", "PARTICULAR", "HSN/SAC CODE", "QTY", "Discount %", "RATE", "AMOUNT"].map((header) => (
                <th key={header} style={{ border: '1px solid #000', padding: 8, textAlign: 'left' }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #000', padding: 8 }}>{idx + 1}</td>
                <td style={{ border: '1px solid #000', padding: 8 }}>
                  {item.product?.name + ' ' + item.product?.description || 'Deleted Product'}
                </td>
                <td style={{ border: '1px solid #000', padding: 8 }}>
                  {item.product?.hsnCode || '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: 8 }}>{item.quantity}</td>
                {/* <td style={{ border: '1px solid #000', padding: 8 }}>₹{item.product.price}</td> */}
                
                <td style={{ border: '1px solid #000', padding: 8 }}>
                  {item.newDiscountPercentage !== undefined
                    ? parseFloat(item.newDiscountPercentage).toFixed(2)
                    : (
                        item.product?.price
                          ? (((item.product.price - item.salePrice) / item.product.price) * 100).toFixed(2)
                          : 'N/A'
                      )}
                  %
                </td>
                <td style={{ border: '1px solid #000', padding: 8 }}>₹{item.salePrice.toFixed(2)}</td>
                <td style={{ border: '1px solid #000', padding: 8 }}>
                  ₹{(item.quantity * item.salePrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <table style={{ width: '300px' }}>
            <tbody>
              <tr>
                <td style={{ padding: 4,fontWeight: 'bold' }}>TOTAL</td>
                <td style={{ padding: 4,fontWeight: 'bold' }}>₹{totalAmount.toFixed(2)}</td>
              </tr>
              {/* <tr>
                <td style={{ padding: 4 }}>CGST @{taxRate}%</td>
                <td style={{ padding: 4 }}>₹{cgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ padding: 4 }}>SGST @{taxRate}%</td>
                <td style={{ padding: 4 }}>₹{sgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ padding: 4, fontWeight: 'bold' }}>GRAND TOTAL</td>
                <td style={{ padding: 4, fontWeight: 'bold' }}>₹{grandTotal.toFixed(2)}</td>
              </tr> */}
            </tbody>
          </table>
        </Box>

        {/* Bank & Terms Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2">
            Name of Bank: {companyInfo.bank.name} | Branch: {companyInfo.bank.branch}
          </Typography>
          <Typography variant="body2">
            Account No: {companyInfo.bank.account} | IFSC CODE: {companyInfo.bank.ifsc}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Rs: {numberToWords(totalAmount)}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Terms & Conditions:
          </Typography>
          <Typography variant="body2">
            1. Payment will be before the delivery of Goods.
          </Typography>
          <Typography variant="body2">
            2. Price inclusive of all taxes.
          </Typography>
        </Box>

        {/* Signature */}
        <Box sx={{ textAlign: 'right', mt: 4 }}>
          <Typography variant="body2" sx={{ borderTop: '1px solid #000', display: 'inline-block' }}>
            For {companyInfo.name}
          </Typography>
          <br />
          <Typography variant="body2">Authorized Signature</Typography>
        </Box>

        {/* Download PDF button with an ID so we can hide it during PDF generation */}
        <Button
          id="downloadButton"
          variant="contained"
          onClick={downloadPDF}
          sx={{ mt: 3, width: '100%' }}
        >
          Download PDF
        </Button>
      </CardContent>
    </Card>
  );
};

// Helper function for number to words conversion (you might need a proper implementation)
const numberToWords = (number) => {
  // Implement proper number to words conversion logic here
  return "Rupees " + number.toFixed(2) + " only";
};

export default SaleBill;
