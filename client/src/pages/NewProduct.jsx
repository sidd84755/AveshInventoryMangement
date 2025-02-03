import React from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap';
import AddProduct from '../components/AddProduct'
import RecordSale from '../components/RecordSale';
import InventoryList from '../components/InventoryList';

const NewProduct = () => {

    const [products, setProducts] = useState([]);
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type) => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 3000);
      };

    // Fetch products
    const fetchProducts = async () => {
        try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        } catch (err) {
        showAlert('Error fetching products', 'danger');
        }
  };
  useEffect(() => {
      fetchProducts();
    //   fetchSales();
    }, []);
  return (
    <div>
        <div>
            {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
        </div>
        <AddProduct fetchProducts={fetchProducts} showAlert={showAlert} />
        <Col md={6}>
            <RecordSale 
              products={products} 
              fetchProducts={fetchProducts} 
              fetchSales={fetchSales}
              showAlert={showAlert}
            />
        </Col>
        

        <InventoryList 
          products={products} 
          fetchProducts={fetchProducts}
          showAlert={showAlert}
        />
    </div>
  )
}

export default NewProduct