import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Alert,
  Typography,
  Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = ({ onLogin, adminUsername, adminPassword }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (
      credentials.username === adminUsername &&
      credentials.password === adminPassword
    ) {
      onLogin();
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card sx={{ width: 350, boxShadow: 3 }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" marginTop={2} marginBottom={2}>
            Avesh Trading Company
          </Typography>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {error && (
            <Alert
              severity="error"
              sx={{ width: '100%', mt: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2, width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} Inventory Manager
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Login;
