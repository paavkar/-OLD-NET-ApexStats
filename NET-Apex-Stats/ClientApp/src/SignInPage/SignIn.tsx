import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
//import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { useStateValue } from '../state/state';
import { Entry, User } from "../types";
import { Copyright } from '../Copyright/Copyright';

const theme = createTheme();

export default function SignIn() {
  const [, dispatch] = useStateValue();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const { data: user } = await axios.post<User>(`${apiBaseUrl}/Auth/login`, { username: data.get('username'), password: data.get('password') });
      dispatch({ type: "SET_USER", payload: user});
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      const { data: entryListFromApi } = await axios.get<Entry[]>(
        `${apiBaseUrl}/BattleRoyale`, { headers: { Authorization: `bearer ${user.token}` },}
      );
      dispatch({ type: "SET_ENTRY_LIST", payload: entryListFromApi });
    } catch (e) {
      console.error(e);
    }
    /*
    console.log({
      username: data.get('username'),
      password: data.get('password'),
    });*/
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};