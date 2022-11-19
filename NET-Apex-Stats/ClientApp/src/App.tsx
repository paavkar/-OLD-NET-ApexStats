import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, AppBar, Toolbar } from "@mui/material";
import { Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { useStateValue } from "./state";
import { Entry } from "./types";

import StatListPage from "./StatListPge";
import SignIn from './SignInPage/SignIn';
import SignUp from './SignUpPage/SignUp';
import UserMenu from './Menu/CustomMenu';
import { Copyright } from './Copyright/Copyright';


function App() {
  const [ { user }, dispatch] = useStateValue();

React.useEffect(() => {
  const fetchUserEntries = async () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch({ type: "SET_USER", payload: user });
      const { data: entryListFromApi } = await axios.get<Entry[]>(
        `${apiBaseUrl}/BattleRoyale`, { headers: { Authorization: `bearer ${user.token}` },}
      );
      dispatch({ type: "SET_ENTRY_LIST", payload: entryListFromApi });
    };
  };
  void fetchUserEntries();

}, [dispatch]);

/*
  React.useEffect(() => {
    //void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchEntryList = async () => {
      try {
        const { data: entryListFromApi } = await axios.get<Entry[]>(
          `${apiBaseUrl}/BattleRoyale`, { headers: { Authorization: `${token}` },}
        );
        dispatch({ type: "SET_ENTRY_LIST", payload: entryListFromApi });
      } catch (e) {
        console.error(e);
      }
    };
    void fetchEntryList();
  }, [dispatch]);
  */

  return (
    <div className="App">
      <Router>
        <Container>
          {user.username === "" ? 
          <div>
            <AppBar position='relative'>
              <Toolbar>
                <Typography variant="h6" style={{ marginRight: "0.5em" }}>
                  Apex Legends Stats
                </Typography>
                <Button component={Link} to="/" variant="contained" color="primary" >
                  Login
                </Button>
                <Button component={Link} to="/register" variant="contained" color="primary" style={{ marginLeft: "0.5em" }}>
                 Sign up
                </Button>
              </Toolbar>
            </AppBar>
            <Divider hidden />
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
            </Routes>
          </div>
            :
          <div>
            <AppBar position='relative'>
              <Toolbar>
                <Typography variant="h6" style={{ marginRight: "0.5em" }}>
                  Apex Legends Stats
                </Typography>
                <Button component={Link} to="/" variant="contained" color="primary">
                  Home
                </Button>
                <UserMenu />
              </Toolbar>
            </AppBar>
            <Routes>
              <Route path="/" element={<StatListPage />} />
            </Routes>
            <Copyright sx={{ mt: 5 }} />
          </div>
          }
        </Container>
      </Router>
    </div>
  );
}

export default App;