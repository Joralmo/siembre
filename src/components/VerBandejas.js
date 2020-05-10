import React, { Component } from 'react';
import {
    Heading,
    Box,
    Text,
    Image,
    Stack,
    Button,
    Divider,
} from '@chakra-ui/core';
import { Auth0Context } from '../react-auth0-spa';
import verifyError from '../utils/verifyError';
import makeQuery from '../apollo/apollo';
import { GET_TRAYS } from '../graphQuerys';
import Scrollbar from 'react-scrollbars-custom';
import TraySvg from '../assets/tray.svg';
import EmptySvg from '../assets/undraw_empty_cart_co35.svg';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';

export default class VerBandejas extends Component {
    static contextType = Auth0Context;
    constructor(props) {
        moment.locale('es');
        super(props);
        this.state = {
            trays: [],
            show: false,
        };
    }

    async componentDidMount() {
        const operation = {
            query: GET_TRAYS,
        };
        const { data, errors } = await makeQuery(operation);
        if (errors) {
            verifyError(errors, this.context.loginWithRedirect);
            return;
        }
        this.setState({ trays: data.trays, show: true });
    }

    Trays = () => {
        const { trays } = this.state;
        if (trays.length)
            return trays.map((e) => (
                <Stack key={e.id} isInline spacing={10}>
                    <Image size="100px" src={TraySvg} alt="tray" />
                    <Heading size="md" mt="auto" mb="auto" minW="40%">
                        {e.name} [{e.rows}]x[{e.columns}]
                    </Heading>
                    <Divider orientation="vertical" />
                    <Text margin="auto">
                        Creada {moment(e.createdAt).fromNow()}
                    </Text>
                    <NavLink
                        style={{ margin: 'auto' }}
                        to={'/dashboard/trays/' + e.id}
                    >
                        <Button bg="transparent" border="1px">
                            Ver
                        </Button>
                    </NavLink>
                </Stack>
            ));
        else
            return (
                <Stack>
                    <Heading size="md">Nada por aquí, nada por allá</Heading>
                    <Image m="auto" size="30%" src={EmptySvg} alt="vacío" />
                    <NavLink
                        style={{ margin: 'auto', marginTop: '20px' }}
                        to="/dashboard/trays/create"
                    >
                        <Button bg="transparent" border="1px">
                            Crea tu primera bandeja
                        </Button>
                    </NavLink>
                </Stack>
            );
    };

    render() {
        const linkStyle = {
            color: 'white',
        };
        return (
            <div
                style={{
                    display: 'table-row',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <Box mt="30px" mb="20px">
                    <Heading>Listado de tus bandejas</Heading>
                </Box>
                {this.state.show && (
                    <Scrollbar
                        style={{
                            width: '90%',
                            marginLeft: '5%',
                            minWidth: '75%',
                            maxHeight: '75%',
                        }}
                    >
                        <Box p="25px" boxSizing="border-box">
                            <this.Trays />
                        </Box>
                    </Scrollbar>
                )}
                <Box>
                    {this.state.show && (
                        <Text
                            fontSize="xs"
                            position="absolute"
                            bottom="0"
                            left="50%"
                        >
                            Iconos diseñados por{' '}
                            <a
                                style={linkStyle}
                                href="http://www.creaticca.com/"
                                title="Creaticca Creative Agency"
                                target="blank"
                            >
                                Creaticca Creative Agency
                            </a>{' '}
                            from{' '}
                            <a
                                style={linkStyle}
                                href="https://www.flaticon.es/"
                                title="Flaticon"
                                target="blank"
                            >
                                {' '}
                                www.flaticon.es
                            </a>
                            ; Imagen tomada de{' '}
                            <a style={linkStyle} href="https://undraw.co/" target="blank">
                                undraw
                            </a>
                        </Text>
                    )}
                </Box>
            </div>
        );
    }
}

const NavLink = ({ children, ...props }) => (
    <Link px={2} color="white" {...props}>
        {children}
    </Link>
);
