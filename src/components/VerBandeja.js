import React, { Component } from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/core';
import Bandeja from './Bandeja';
import { GET_TRAY_BY_ID } from '../graphQuerys';
import makeQuery from '../apollo/apollo';

export default class VerBandeja extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mostrarBandeja: false,
            tray_id: 0,
            tray: null,
        };
    }

    async componentDidMount() {
        this.setState({ tray_id: this.props.match.params.tray_id });
        const operation = {
            query: GET_TRAY_BY_ID,
            variables: { trayId: this.props.match.params.tray_id },
        };
        const { data, errors } = await makeQuery(operation);
        if (errors) alert('Error obteniendo la bandeja');
        const { trays_by_pk } = data;
        this.setState({ tray: trays_by_pk, mostrarBandeja: true });
    }

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
        const { tray } = this.state;
        return (
            <div
                style={{
                    display: 'table-row',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <Box mt="30px" mb="20px">
                    Las macetas sin color aún no le has dado un nombre, pulsa
                    alguna para darle un nombre
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
                            cells={tray.cells}
                            boxHeight={height}
                            boxWidth={width}
                            rows={parseInt(tray.rows)}
                            columns={parseInt(tray.columns)}
                        />
                    )}
                </Box>
                <Box mt="50px">
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
                </Box>
            </div>
        );
    }
}
