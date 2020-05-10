import React, { Component } from 'react';
import { Spinner } from '@chakra-ui/core';
import { Auth0Context } from '../react-auth0-spa';

export default class GuardarToken extends Component {
    static contextType = Auth0Context;
    componentDidMount() {
        this.context.getIdTokenClaims().then(({ __raw: token }) => {
            localStorage.setItem('siembreAppToken', token);
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        });
    }
    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Spinner emptyColor="gray.200" size="xl" color="tomato" />
            </div>
        );
    }
}
