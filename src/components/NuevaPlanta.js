import React, { Component } from 'react';
import {
    FormControl,
    FormLabel,
    FormHelperText,
    Button,
    Input,
    Alert,
    Spinner,
    AlertIcon,
    CloseButton,
} from '@chakra-ui/core';
import { NEW_PLANT } from '../graphQuerys';
import makeQuery from '../apollo/apollo';
import verifyError from '../utils/verifyError';
import { Auth0Context } from '../react-auth0-spa';

export default class NuevaPlanta extends Component {
    static contextType = Auth0Context;
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            loading: false,
            showAlert: false,
        };
    }

    guardar = async () => {
        this.setState({ loading: true });
        const { user, loginWithRedirect } = this.context;
        const plant = [
            {
                name: this.state.name,
                user_id: user.sub,
            },
        ];

        const operation = {
            query: NEW_PLANT,
            variables: { plant },
        };

        const { errors } = await makeQuery(operation);

        if (errors) {
            verifyError(errors, loginWithRedirect);
            return;
        }

        this.setState({ loading: false, showAlert: true });
    };

    render() {
        if (this.state.loading) {
            return (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <Spinner size="xl" color="white" />
                </div>
            );
        }
        return (
            <div style={{ width: '100%' }}>
                {this.state.showAlert && (
                    <Alert status="success">
                        <AlertIcon />
                        Planta guardada con éxito
                        <CloseButton
                            position="absolute"
                            right="8px"
                            top="8px"
                            onClick={() => this.setState({ showAlert: false })}
                        />
                    </Alert>
                )}
                <div
                    style={{
                        margin: 'auto',
                        width: '100%',
                        height: '90%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="name">Nombre</FormLabel>
                        <Input
                            type="text"
                            id="name"
                            aria-describedby="name-helper-text"
                            onChange={({ target: { value: name } }) =>
                                this.setState({ name })
                            }
                        />
                        <FormHelperText color="white" id="name-helper-text">
                            El nombre de la nueva planta
                        </FormHelperText>
                        <Button mt="10px" onClick={this.guardar} bg="white">
                            Guardar
                        </Button>
                    </FormControl>
                </div>
            </div>
        );
    }
}
