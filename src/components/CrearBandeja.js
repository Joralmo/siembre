import React, { Component } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Select,
    Grid,
    Box,
    Text,
} from '@chakra-ui/core';
import Bandeja from './Bandeja';
import { Auth0Context } from '../react-auth0-spa';
import { NEW_TRAY, NEW_CELLS } from '../graphQuerys';
import makeQuery from '../apollo/apollo';
// import { execute, makePromise } from 'apollo-link';

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
        super();
        this.state = {
            rows: 0,
            columns: 0,
            mostrarBandeja: false,
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
        const { mostrarBandeja, rows, columns } = this.state;
        if (rows && columns) {
            if (!mostrarBandeja) {
                this.setState({ mostrarBandeja: true });
                return;
            }

            const { user } = this.context;
            const { rows, columns } = this.state;
            const cells = [];

            let operation = {
                query: NEW_TRAY,
                variables: {
                    userId: user.sub,
                    rows,
                    columns,
                },
            };

            let {
                data: {
                    insert_trays: { returning },
                },
                errors,
            } = await makeQuery(operation);
            if (errors) alert('Error al guardar la bandeja');
            const { id: tray_id } = returning[0];
            new Array(rows).fill(0).map((e, i) => {
                new Array(columns).fill(0).map((e, j) => {
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
            let data;
            ({ data, errors } = await makeQuery(operation));
            if (errors) alert('Error al guardar las celdas');
            window.location.href = '/dashboard/trays/' + tray_id;
        }
    };

    render() {
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
                <Box w="90%" h="20%" ml="5%">
                    <FormControl marginTop="10px">
                        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                            <Box w="100%" h="10">
                                <FormLabel htmlFor="rows">Filas</FormLabel>
                                <Select
                                    defaultValue={this.state.rows}
                                    onChange={({ target: { value: rows } }) =>
                                        this.setState({ rows })
                                    }
                                    placeholder="Filas"
                                >
                                    <Options />
                                </Select>
                            </Box>
                            <Box w="100%" h="10">
                                <FormLabel htmlFor="columns">
                                    Columnas
                                </FormLabel>
                                <Select
                                    defaultValue={this.state.columns}
                                    onChange={({
                                        target: { value: columns },
                                    }) => this.setState({ columns })}
                                    placeholder="Columnas"
                                >
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
                >
                    {this.state.mostrarBandeja && (
                        <Bandeja
                            boxHeight={height}
                            boxWidth={width}
                            rows={parseInt(this.state.rows)}
                            columns={parseInt(this.state.columns)}
                        />
                    )}
                </Box>
                <Box mt="50px">
                    {this.state.mostrarBandeja && (
                        <Text fontSize="xs">
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
                        </Text>
                    )}
                </Box>
            </div>
        );
    }
}
