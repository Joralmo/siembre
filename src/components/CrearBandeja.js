import React, { Component } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Select,
    Grid,
    Box,
    Text,
    Input,
    Spinner,
    Image,
} from '@chakra-ui/core';
import Bandeja from './Bandeja';
import { Auth0Context } from '../react-auth0-spa';
import { NEW_TRAY, NEW_CELLS } from '../graphQuerys';
import makeQuery from '../apollo/apollo';
import verifyError from '../utils/verifyError';
import moment from 'moment';
import 'moment/locale/es';
import ImageSvg from '../assets/undraw_air_support_wy1q.svg';

const Options = () => {
    return new Array(10).fill(0).map((e, i) => (
        <option key={i} id={i + 1}>
            {i + 1}
        </option>
    ));
};

export default class CrearBandeja extends Component {
    static contextType = Auth0Context;
    constructor() {
        moment.locale('es');
        super();
        this.state = {
            rows: 0,
            columns: 0,
            nombre: 'Mi bandeja',
            mostrarBandeja: false,
            loading: false,
        };
    }

    async componentDidMount() {
        // const operation = {
        //     query: GET_EMAILS
        // }
        // const { data, errors } = await makeQuery(operation);
        // if (errors) alert('Error en la consulta de datos');
        // console.log(data);
    }

    textButton = () => {
        const { columns, rows, mostrarBandeja } = this.state;
        let texto = 'Vista previa';
        if (columns && rows && mostrarBandeja) {
            texto = 'Guardar';
        }
        return texto;
    };

    preview = async () => {
        const { mostrarBandeja, rows, columns, nombre } = this.state;
        if (rows && columns) {
            if (!mostrarBandeja) {
                this.setState({ mostrarBandeja: true });
                return;
            }

            this.setState({ loading: true });
            const { user } = this.context;
            const { rows, columns } = this.state;
            const cells = [];

            console.log(moment().format());
            console.log(moment().unix());

            let operation = {
                query: NEW_TRAY,
                variables: {
                    userId: user.sub,
                    rows,
                    columns,
                    nombre,
                    createdAt: moment().format(),
                },
            };
            let { data, errors } = await makeQuery(operation);
            if (errors) {
                verifyError(errors, this.context.loginWithRedirect);
                return;
            }
            const {
                insert_trays: { returning },
            } = data;
            const { id: tray_id } = returning[0];
            new Array(parseInt(rows)).fill(0).map((e, i) => {
                new Array(parseInt(columns)).fill(0).map((e, j) => {
                    cells.push({
                        posX: i,
                        posY: j,
                        tray_id,
                    });
                });
            });

            operation = {
                query: NEW_CELLS,
                variables: {
                    cells,
                },
            };
            ({ data, errors } = await makeQuery(operation));
            if (errors) {
                verifyError(errors, this.context.loginWithRedirect);
                return;
            }
            window.location.href = '/dashboard/trays/' + tray_id;
        }
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
        const containerBandeja = window.document.getElementsByClassName(
            'containerBandeja'
        )[0];
        const { offsetWidth: width, offsetHeight: height } = containerBandeja
            ? containerBandeja
            : { offsetHeight: 0, offsetWidth: 0 };
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
                <Box w="90%" h="10%" ml="5%">
                    <FormControl marginTop="10px">
                        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                            <Box w="100%" h="10">
                                <FormLabel htmlFor="name">Nombre</FormLabel>
                                <Input
                                    defaultValue={this.state.nombre}
                                    type="text"
                                    id="nombre"
                                    w="80%"
                                    h="90%"
                                    aria-describedby="nombre-helper-text"
                                    onChange={({ target: { value: nombre } }) =>
                                        this.setState({ nombre })
                                    }
                                />
                            </Box>
                            <Box w="100%" h="10">
                                <FormLabel htmlFor="rows">Filas</FormLabel>
                                <Select
                                    w="80%"
                                    defaultValue={this.state.rows}
                                    onChange={({ target: { value: rows } }) =>
                                        this.setState({ rows })
                                    }
                                >
                                    <option disabled value="0">
                                        0
                                    </option>
                                    <Options />
                                </Select>
                            </Box>
                            <Box w="100%" h="10">
                                <FormLabel htmlFor="columns">
                                    Columnas
                                </FormLabel>
                                <Select
                                    w="80%"
                                    defaultValue={this.state.columns}
                                    onChange={({
                                        target: { value: columns },
                                    }) => this.setState({ columns })}
                                >
                                    <option disabled value="0">
                                        0
                                    </option>
                                    <Options />
                                </Select>
                            </Box>
                            <Box w="100%" h="10" marginTop="5px">
                                <Button
                                    bg="transparent"
                                    mt={4}
                                    border="1px"
                                    type="submit"
                                    onClick={this.preview}
                                >
                                    {this.textButton()}
                                </Button>
                            </Box>
                        </Grid>
                    </FormControl>
                </Box>
                <Box
                    className="containerBandeja"
                    w="100%"
                    minH="75%"
                    maxH="75%"
                    padding="10px"
                    boxSizing="border-box"
                    display={this.state.mostrarBandeja ? "block" : "flex"}
                    alignItems="center"
                    justifyContent="center"
                >
                    {this.state.mostrarBandeja && (
                        <Bandeja
                            parent="crear"
                            boxHeight={height}
                            boxWidth={width}
                            rows={parseInt(this.state.rows)}
                            columns={parseInt(this.state.columns)}
                        />
                    )}
                    {!this.state.mostrarBandeja && (
                        <Image
                            src={ImageSvg}
                            w="40%"
                            alt="esperando"
                        />
                    )}
                </Box>
                <Box>
                    <Text
                        fontSize="xs"
                        position="absolute"
                        bottom="0"
                        left="50%"
                    >
                        Iconos diseñados por{' '}
                        <a
                            style={linkStyle}
                            href="https://www.flaticon.es/autores/freepik"
                            title="Freepik"
                            target="blank"
                        >
                            Freepik
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
                        <a
                            style={linkStyle}
                            href="https://undraw.co/"
                            target="blank"
                        >
                            undraw
                        </a>
                    </Text>
                </Box>
            </div>
        );
    }
}
