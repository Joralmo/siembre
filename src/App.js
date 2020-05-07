// src/App.js

import React from 'react';
import NavBar from './components/NavBar';
import { Router, Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import history from './utils/history';
import PrivateRoute from './components/PrivateRoute';
import { useAuth0 } from './react-auth0-spa';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    ThemeProvider,
    Spinner,
    CloseButton,
} from '@chakra-ui/core';

const getURLParameters = (url) =>
    (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
        (a, v) => (
            (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
        ),
        {}
    );

function App() {
    const { loading } = useAuth0();
    const { error_description } = getURLParameters(window.location.href);
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
                {error_description && (
                    <Alert status="error">
                        <AlertIcon />
                        <AlertTitle mr={2}>Error en el registro!</AlertTitle>
                        <AlertDescription>
                            {decodeURI(error_description)}
                        </AlertDescription>
                        <CloseButton
                            position="absolute"
                            right="8px"
                            top="8px"
                        />
                    </Alert>
                )}
            </ThemeProvider>
            <Switch>
                <Route path="/" exact />
                <PrivateRoute path="/profile" component={Profile} />
            </Switch>
        </Router>
    );
}

export default App;
