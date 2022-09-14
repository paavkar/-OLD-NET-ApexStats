import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container } from "@mui/material";
import { Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { useStateValue } from "./state";
import { Entry } from "./types";

import StatListPage from "./StatListPge";
import SignIn from './SignInPage/SignIn';
import SignUp from './SignUpPage/SignUp';


function App() {
  const [ { user }, dispatch] = useStateValue();

let token: string | null = null;


const setToken = (newToken: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token = `bearer ${newToken}`
 
};

React.useEffect(() => {
  const fetchUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch({ type: "SET_USER", payload: user });
      setToken(user.token);
    };
  };
  void fetchUser();
}, [dispatch]);

  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchEntryList = async () => {
      try {
        const { data: entryListFromApi } = await axios.get<Entry[]>(
          `${apiBaseUrl}/br`, { headers: { Authorization: `${token}` },}
        );
        dispatch({ type: "SET_ENTRY_LIST", payload: entryListFromApi });
      } catch (e) {
        console.error(e);
      }
    };
    void fetchEntryList();
  }, [dispatch]);

  const logout = () => {
    window.localStorage.removeItem('loggedUser');
    dispatch({ type: "SET_USER", payload: { id: "", username: "", password: "", token: "" } });
    token = null;
  }

  return (
    <div className="App">
      
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Apex Legends Stats
          </Typography>
          {user.username === "" ? 
          <div>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Button component={Link} to="/register" variant="contained" color="primary" style={{ marginLeft: "0.5em" }}>
            Sign up
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
          </Routes>
          </div>
             :
          <div>
            <Typography variant="h6" style={{ marginBottom: "0.5em" }}>
            {user.username} is logged in
          </Typography>
            <Button component={Link} to="/" variant="contained" color="primary">
            Home
            </Button>
            <Button onClick={() => logout()} variant="contained" color="primary" style={{ marginLeft: "0.5em" }} >
            Logout
            </Button>
            <Routes>
              <Route path="/" element={<StatListPage />} />
            </Routes>
          </div>
          }
          
        </Container>
      </Router>
    </div>
  );
}

export default App;
