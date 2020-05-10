import React, { Component } from 'react';
import { Auth0Context } from '../react-auth0-spa';
import { Link } from 'react-router-dom';
import { Box, Flex, Image, Heading, Button } from '@chakra-ui/core';

export default class NavBar extends Component {
    static contextType = Auth0Context;
    constructor() {
        super();
        this.state = {
            show: false,
        };
    }
    render() {
        const handleToggle = () => this.setState({ show: !this.state.show });
        const {
            isAuthenticated,
            loginWithRedirect,
            logout,
            user,
        } = this.context;
        const avatar = user
            ? user.picture
            : 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Android_O_Preview_Logo.png';
        const nickname = user ? user.nickname : 'Invitado';
        return (
            <Flex
                as="nav"
                align="center"
                justify="space-between"
                wrap="wrap"
                padding="1.5rem"
                bg="tomato"
                color="white"
            >
                <Flex align="center" mr={5}>
                    <Image
                        src={avatar}
                        size={60}
                        style={{ borderRadius: '50%', marginRight: '10px' }}
                    />
                    <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
                        {nickname}
                    </Heading>
                </Flex>
                <Box
                    display={{ sm: 'block', md: 'none' }}
                    onClick={handleToggle}
                >
                    <svg
                        fill="white"
                        width="12px"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </Box>
                <Box
                    display={{
                        sm: this.state.show ? 'block' : 'none',
                        md: 'block',
                    }}
                    mt={{ base: 4, md: 0 }}
                >
                    {isAuthenticated ? (
                        <Flex>
                            <NavLink style={{ marginRight: '10px' }} to="/home">
                                <Button bg="transparent" border="1px">
                                    Home
                                </Button>
                            </NavLink>
                            <NavLink
                                style={{ marginRight: '10px' }}
                                to="/profile"
                            >
                                <Button bg="transparent" border="1px">
                                    Perfil
                                </Button>
                            </NavLink>
                            <Button
                                bg="transparent"
                                onClick={() => {
                                    localStorage.removeItem('siembreAppToken');
                                    logout({});
                                }}
                                border="1px"
                            >
                                Cerrar sesión
                            </Button>
                        </Flex>
                    ) : (
                        <Button
                            bg="transparent"
                            onClick={() => loginWithRedirect({})}
                            border="1px"
                        >
                            Iniciar sesión
                        </Button>
                    )}
                </Box>
            </Flex>
        );
    }
}

const NavLink = ({ children, ...props }) => (
    <Link px={2} color="white" {...props}>
        {children}
    </Link>
);
