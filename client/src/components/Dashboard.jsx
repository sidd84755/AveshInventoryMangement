// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // Required for rendering points on line charts
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to generate an array of date strings for the last 7 days (YYYY-MM-DD)
const generateLast7Days = (referenceDate = new Date()) => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const Dashboard = () => {
  // States for products and sales data from API
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  // State for selected date (for table view)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  // States for chart data
  const [chartSales, setChartSales] = useState([]);
  const [chartProfit, setChartProfit] = useState([]);
  const [dates, setDates] = useState([]);
  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch products and sales data from endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch('https://aveshinventorymangement.onrender.com/api/products');
        const salesResponse = await fetch('https://aveshinventorymangement.onrender.com/api/sales');
        const productsData = await productsResponse.json();
        const salesData = await salesResponse.json();
        setProducts(productsData);
        setSales(salesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group sales data by day for the last 7 days
  useEffect(() => {
    const last7Days = generateLast7Days(new Date(selectedDate));
    setDates(last7Days);

    // For each day, sum total sales and profit.
    const salesPerDay = [];
    const profitPerDay = [];
    
    last7Days.forEach((day) => {
      // Filter sales whose saleDate (date portion) matches the day
      const salesForTheDay = sales.filter((sale) => {
        const saleDate = sale.saleDate.split('T')[0];
        return saleDate === day;
      });
      
      let dayTotalSales = 0;
      let dayTotalProfit = 0;
      salesForTheDay.forEach((sale) => {
        sale.items.forEach((item) => {
          if (item.product) {
            const saleAmount = item.salePrice * item.quantity;
            const profitPerUnit = item.salePrice - item.product.costPrice;
            dayTotalSales += saleAmount;
            dayTotalProfit += profitPerUnit * item.quantity;
          }
        });
      });

      salesPerDay.push(dayTotalSales);
      profitPerDay.push(dayTotalProfit);
    });

    setChartSales(salesPerDay);
    setChartProfit(profitPerDay);
  }, [sales, selectedDate]);

  // Find sales for the selected date (for the table view)
  const salesForSelectedDate = sales.find(
    (sale) => sale.saleDate.split('T')[0] === selectedDate
  );

  // Compute All-Time Metrics
  const totalInventoryValue = products.reduce(
    (acc, product) => acc + product.price * product.stock, 0
  );

  const totalSalesAllTime = sales.reduce((acc, sale) => {
    return acc + sale.items.reduce((itemAcc, item) => {
      return itemAcc + (item.salePrice * item.quantity);
    }, 0);
  }, 0);

  const totalProfitAllTime = sales.reduce((acc, sale) => {
    return acc + sale.items.reduce((itemAcc, item) => {
      if (item.product) {
        return itemAcc + ((item.salePrice - item.product.costPrice) * item.quantity);
      }
      return itemAcc;
    }, 0);
  }, 0);

  // Chart.js configuration for Sales Line Chart
  const salesLineData = {
    labels: dates,
    datasets: [
      {
        label: 'Daily Sales (₹)',
        data: chartSales,
        fill: false,
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
      },
    ],
  };

  // Chart.js configuration for Profit Bar Chart
  const profitBarData = {
    labels: dates,
    datasets: [
      {
        label: 'Daily Profit (₹)',
        data: chartProfit,
        backgroundColor: '#388e3c',
      },
    ],
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {/* All-Time Metrics Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Total Inventory Value" />
            <CardContent>
              <Typography variant="h6">₹{totalInventoryValue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Total Sales (All Time)" />
            <CardContent>
              <Typography variant="h6">₹{totalSalesAllTime.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Total Profit (All Time)" />
            <CardContent>
              <Typography variant="h6">₹{totalProfitAllTime.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Card for Selected Date */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <CardHeader title="Today's Sales & Profit" />
            <CardContent>
              <Typography variant="h6">Date: {selectedDate}</Typography>
              {salesForSelectedDate ? (
                (() => {
                  let totalSales = 0;
                  let totalProfit = 0;
                  salesForSelectedDate.items.forEach((item) => {
                    if (item.product) {
                      const saleAmount = item.salePrice * item.quantity;
                      const profitPerUnit = item.salePrice - item.product.costPrice;
                      totalSales += saleAmount;
                      totalProfit += profitPerUnit * item.quantity;
                    }
                  });
                  return (
                    <>
                      <Typography variant="body1">
                        Total Sales: ₹{totalSales.toFixed(2)}
                      </Typography>
                      <Typography variant="body1">
                        Total Profit: ₹{totalProfit.toFixed(2)}
                      </Typography>
                    </>
                  );
                })()
              ) : (
                <>
                  <Typography variant="body1">Total Sales: ₹0.00</Typography>
                  <Typography variant="body1">Total Profit: ₹0.00</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Date Picker */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <CardHeader title="Select Date" />
            <CardContent>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Line Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Sales (Last 7 Days)" />
            <CardContent>
              <Line key="sales-line-chart" data={salesLineData} />
            </CardContent>
          </Card>
        </Grid>
        {/* Profit Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Profit (Last 7 Days)" />
            <CardContent>
              <Bar key="profit-bar-chart" data={profitBarData} />
            </CardContent>
          </Card>
        </Grid>
        {/* Sales List Table for Selected Date */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Sales List for Selected Date" />
            <CardContent>
              {salesForSelectedDate ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Sale Price (₹)</TableCell>
                        <TableCell>Subtotal (₹)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salesForSelectedDate.items.map((item, idx) => {
                        const product = item.product;
                        const subtotal = product ? item.salePrice * item.quantity : 0;
                        return (
                          <TableRow key={idx}>
                            <TableCell>
                              {product
                                ? `${product.name} ${
                                    product.description ? '- ' + product.description : ''
                                  }`
                                : 'Deleted Product'}
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.salePrice.toFixed(2)}</TableCell>
                            <TableCell>{subtotal.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1">
                  No sales data for {selectedDate}.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Refresh Dashboard Button */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Refresh Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
