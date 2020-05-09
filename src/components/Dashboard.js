import React, { Component } from 'react';
import { Button, Flex, Box, SimpleGrid } from '@chakra-ui/core';
import { Link, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import CrearBandeja from './CrearBandeja';
import VerBandeja from './VerBandeja';

export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            height: 100,
        };
    }
    componentDidMount() {
        const navHeight = window.document.getElementsByTagName('nav')[0];
        this.setState({ height: navHeight.offsetHeight });
        // console.log(navHeight.offsetHeight);
    }
    render() {
        return (
            <Flex
                align="center"
                style={{ height: `calc(100vh - ${this.state.height}px)` }}
            >
                <Flex
                    w="25%"
                    h="100%"
                    bg="blue.50"
                    align="center"
                    justify="center"
                    backgroundColor="#1a202c"
                >
                    <SimpleGrid columns={1} spacing={10}>
                        <Box>
                            <NavLink
                                style={{ marginRight: '10px' }}
                                to="/dashboard/trays/create"
                            >
                                <Button bg="transparent" border="1px">
                                    Mis bandejas
                                </Button>
                            </NavLink>
                        </Box>
                        <Box>
                            <NavLink
                                style={{ marginRight: '10px' }}
                                to="/dashboard/trays/create"
                            >
                                <Button bg="transparent" border="1px">
                                    Crear bandeja
                                </Button>
                            </NavLink>
                        </Box>
                    </SimpleGrid>
                </Flex>
                <Flex
                    style={{
                        boxShadow: '1px 1px 20px 4px rgba(0, 0, 0, 0.5) inset',
                    }}
                    w="75%"
                    h="100%"
                    bg="tomato"
                    justify="center"
                >
                    <Switch>
                        <PrivateRoute
                            path="/dashboard/trays/create"
                            component={CrearBandeja}
                        />
                        <PrivateRoute
                            path="/dashboard/trays/:tray_id"
                            component={VerBandeja}
                        />
                    </Switch>
                </Flex>
            </Flex>
        );
    }
}

const NavLink = ({ children, ...props }) => (
    <Link px={2} color="white" {...props}>
        {children}
    </Link>
);
