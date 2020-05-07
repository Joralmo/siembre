// src/App.js

import React from "react";
import NavBar from "./components/NavBar";
import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth0 } from "./react-auth0-spa";
import { ThemeProvider, Spinner } from '@chakra-ui/core';

function App() {
  const { loading } = useAuth0();
  if (loading) {
    return (
      <div
          style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
          }}
      >
        <ThemeProvider>
          <Spinner size="xl" color="tomato" />
        </ThemeProvider>
      </div>
    );
  }
  return (
    <Router history={history}>
      <ThemeProvider>
        <NavBar />
      </ThemeProvider>
      <Switch>
        <Route path="/" exact />
        <PrivateRoute path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;