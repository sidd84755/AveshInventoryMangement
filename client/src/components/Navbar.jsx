import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const AppNavbar = ({ onLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ fontSize: '1.25rem', textTransform: 'none' }}
          >
            Inventory Manager
          </Button>
        </Typography>
        
        <Button color="inherit" component={Link} to="/add-product">
          Add Product
        </Button>
        <Button color="inherit" component={Link} to="/record-sale">
          Record Sale
        </Button>
        <Button color="inherit" component={Link} to="/inventory">
          Inventory
        </Button>
        <Button color="inherit" component={Link} to="/sales">
          Sales
        </Button>
        <Button color="inherit" onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;