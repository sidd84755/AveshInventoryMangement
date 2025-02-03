import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Button } from 'react-bootstrap';

const AppNavbar = ({ onLogout }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <div className="container">
        <BsNavbar.Brand as={Link} to="/">Inventory Manager</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/add-product">Add Product</Nav.Link>
            <Nav.Link as={Link} to="/record-sale">Record Sale</Nav.Link>
            <Nav.Link as={Link} to="/inventory">Inventory</Nav.Link>
            <Nav.Link as={Link} to="/sales">Sales</Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
        </BsNavbar.Collapse>
      </div>
    </BsNavbar>
  );
};

export default AppNavbar;