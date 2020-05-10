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
import Home from './components/Home';
import Dashboard from './components/Dashboard';

const getURLParameters = (url) =>
    (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
        (a, v) => (
            (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
        ),
        {}
    );

function App() {
    const { loading, getIdTokenClaims, user } = useAuth0();
    if (user)
        if (!localStorage.getItem('siembreAppToken')) {
            getIdTokenClaims().then(({ __raw: token }) => {
                localStorage.setItem('siembreAppToken', token);
            });
        }
    let { error_description } = getURLParameters(window.location.href);
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
                {window.location.pathname !== '/callback' && <NavBar />}
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
                            onClick={() => (window.location.href = '/')}
                        />
                    </Alert>
                )}
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route path="/home" component={Home} />
                    <PrivateRoute path="/profile" component={Profile} />
                    <PrivateRoute path="/dashboard" component={Dashboard} />
                </Switch>
            </ThemeProvider>
        </Router>
    );
}

export default App;
