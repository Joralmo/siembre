import React, { Component } from 'react';
import { Box, Button, Stack, Heading, Text, Image } from '@chakra-ui/core';
import FarmSvg from '../assets/undraw_farm_girl_dnpe.svg';
import { Auth0Context } from '../react-auth0-spa';
import { Link } from 'react-router-dom';

const NavLink = ({ children, ...props }) => (
    <Link px={2} color="white" {...props}>
        {children}
    </Link>
);

export default class Home extends Component {
    static contextType = Auth0Context;
    constructor() {
        super();
        this.state = {
            height: 100,
        };
    }
    componentDidMount() {
        const navHeight = window.document.getElementsByTagName('nav')[0];
        this.setState({ height: navHeight.offsetHeight });
    }
    render() {
        const { isAuthenticated, loginWithRedirect } = this.context;
        const Auth = () => {
            if (isAuthenticated) {
                return (
                    <NavLink to="/dashboard">
                        <Button bg="transparent" border="1px">
                            Mis bandejas
                        </Button>
                    </NavLink>
                );
            } else {
                return (
                    <Button
                        color="tomato"
                        onClick={() => loginWithRedirect({})}
                    >
                        Crear una cuenta
                    </Button>
                );
            }
        };

        return (
            <div
                style={{
                    display: 'flex',
                    height: `calc(100vh - ${this.state.height}px)`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#1a202c',
                }}
            >
                <Stack
                    spacing={8}
                    align="center"
                    justify="center"
                    verticalAlign="center"
                >
                    <Box
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        flex="1"
                        rounded="md"
                        textAlign="center"
                    >
                        <Heading fontSize="xl">
                            Administra tus bandejas de germinación
                        </Heading>
                        <Image
                            margin="auto"
                            src={FarmSvg}
                            htmlWidth="50%"
                            padding="2%"
                        />
                        <Text></Text>
                        <Auth />
                        <Text fontSize="xs" mt="10px">
                            Imagen tomada de{' '}
                            <a href="https://undraw.co/" target="blank">
                                undraw
                            </a>
                        </Text>
                    </Box>
                </Stack>
            </div>
        );
    }
}
