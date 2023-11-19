import { Navigate, useNavigate } from 'react-router';
import { useState } from 'react';
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';

async function loginUser(email, password) {
  const response = await fetch('http://localhost:9000/api/account/signin', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  return response.json();
}

const Login = (props) => {
  
  const { user, setUser } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError(false);
  };

  //Api call here
  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await loginUser(email, password);

    if(response.token) {
      // alert("Success");
      localStorage.setItem('token', response.token);

      const profileResponse = await fetch("http://localhost:9000/api/account/profile", {
        headers: {
          Authorization: `Bearer ${response.token}`
        }
      })
      if(profileResponse.status == 200) {
        let profileResponseJson = await profileResponse.json();
        setUser(profileResponseJson.data);
        navigate('/Account');
      }
      else {
        setUser(null);
        localStorage.removeItem('token');
        setPassword("");
        setError(true);
      }

      
    }
    else {
      setPassword("");
      setError(true);
    }
    
  };

    return user && (
        <Navigate to="/Account" />
      ) || !user && (
      <Box component="form" sx={{height: "100%"}} onSubmit={handleLogin}>
          <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" 
            sx={{width: "100%", height: "100%"}}>
            <TextField sx={{minWidth: "400px"}}
              error={Boolean(error)}
              label="Email"
              type="text"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <TextField sx={{minWidth: "400px"}}
              error={Boolean(error)}
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <Divider />
            <Button type="submit" 
              variant="contained" 
              sx={{minWidth: "400px"}} 
              disabled={!(email && password)}
            >
              <Typography variant="body1">Log In</Typography>
            </Button>
          </Stack>
      </Box>
    );
}

export default Login;
