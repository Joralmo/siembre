import React, { Component, Fragment } from 'react';
import {
    Box,
    Grid,
    Text,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Tooltip,
    Textarea,
} from '@chakra-ui/core';
import PlantaSvg from '../assets/planta.svg';
import PlantaGrisSvg from '../assets/naturaleza.svg';
import { UPDATE_CELL } from '../graphQuerys';
import makeQuery from '../apollo/apollo';
import _ from 'lodash';
import verifyError from '../utils/verifyError';
import { Auth0Context } from '../react-auth0-spa';

const Cell = ({ children, ...props }) => {
    const { cell, imagen, parent, fn } = { ...props };
    if (cell.description) {
        return (
            <Tooltip
                hasArrow={false}
                label={cell.description}
                placement="top"
                bg="black"
            >
                <Image
                    src={imagen}
                    h={parent === 'crear' ? '100%' : '85%'}
                    w="100%"
                    onClick={() => fn(cell)}
                />
            </Tooltip>
        );
    } else {
        return (
            <Image
                src={imagen}
                h={parent === 'crear' ? '100%' : '85%'}
                w="100%"
                onClick={() => fn(cell)}
            />
        );
    }
};

export default class Bandeja extends Component {
    static contextType = Auth0Context;
    constructor(props) {
        super(props);

        this.state = {
            rows: props.rows,
            columns: props.columns,
            cellActual: {},
            isOpen: false,
            name: null,
            description: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.rows !== this.props.rows) {
            this.setState({ rows: nextProps.rows });
        } else if (nextProps.columns !== this.props.columns) {
            this.setState({ columns: nextProps.columns });
        }
    }

    componentDidMount() {
        // console.log(this.props);
        // const boxWidth = window.document.getElementsByClassName('celda')[0];
        // this.setState({ height: boxWidth.offsetWidth });
    }

    setCell = (cellActual) => {
        if (cellActual !== false)
            this.setState({
                cellActual,
                isOpen: true,
                name: cellActual.name,
                description: cellActual.description,
            });
    };

    saveCell = async () => {
        const { cellActual, name, description } = this.state;
        const operation = {
            query: UPDATE_CELL,
            variables: {
                id: cellActual.id,
                cell: {
                    name: name,
                    description: description,
                    updatedAt: cellActual.updatedAt,
                },
            },
        };
        const { data, errors } = await makeQuery(operation);
        if (errors) {
            verifyError(errors, this.context.loginWithRedirect);
            return;
        };
        cellActual.name = name;
        cellActual.description = description;
        this.setState({ isOpen: false });
    };

    render() {
        const { rows, columns, cellActual } = this.state;
        let { boxWidth, boxHeight, cells, parent } = this.props;
        let imagen;
        boxHeight = boxHeight / rows;
        boxWidth = boxWidth / columns - boxWidth * 0.02;
        return (
            <Fragment>
                {new Array(rows).fill(0).map((e, i) => (
                    <Grid
                        key={i}
                        templateColumns={`repeat(${columns}, 1fr)`}
                        gap={5}
                        mb="5px"
                    >
                        {new Array(columns).fill(0).map((e, j) => {
                            let cell = _.filter(cells, { posX: i, posY: j })[0];
                            if (parent === 'ver') {
                                imagen = cell.name ? PlantaSvg : PlantaGrisSvg;
                            } else {
                                cell = false;
                                imagen = PlantaSvg;
                            }
                            return (
                                <Box
                                    className="celda"
                                    key={`${i}${j}`}
                                    w={`${boxWidth}px`}
                                    h={`${boxHeight}px`}
                                    bg="blue.500"
                                    backgroundColor="transparent"
                                    display="flex"
                                    justifyContent="center"
                                    cursor="pointer"
                                    display="block"
                                >
                                    {!cell && (
                                        <Image
                                            src={imagen}
                                            h={
                                                parent === 'crear'
                                                    ? '100%'
                                                    : '85%'
                                            }
                                            w="100%"
                                            onClick={() => this.setCell(cell)}
                                        />
                                    )}
                                    {cell && (
                                        <Cell
                                            cell={cell}
                                            imagen={imagen}
                                            parent={parent}
                                            fn={this.setCell}
                                        />
                                    )}
                                    {cell && cell.name && (
                                        <Text
                                            m="0"
                                            p="0"
                                            color="white"
                                            fontWeight="bold"
                                        >
                                            {cell.name}
                                        </Text>
                                    )}
                                </Box>
                            );
                        })}
                    </Grid>
                ))}
                <Modal
                    isOpen={this.state.isOpen}
                    onClose={() => this.setState({ isOpen: false })}
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Nombre de la planta</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl>
                                <FormLabel htmlFor="name">Nombre</FormLabel>
                                <Input
                                    defaultValue={cellActual.name}
                                    w="90%"
                                    type="text"
                                    id="name"
                                    aria-describedby="name-helper-text"
                                    onChange={({ target: { value: name } }) =>
                                        this.setState({ name })
                                    }
                                />
                                <FormHelperText id="name-helper-text">
                                    Nombre de tu planta
                                </FormHelperText>
                                <FormLabel htmlFor="description">
                                    Descripción
                                </FormLabel>
                                <Textarea
                                    defaultValue={cellActual.description}
                                    w="90%"
                                    type="text"
                                    id="description"
                                    aria-describedby="description-helper-text"
                                    onChange={({
                                        target: { value: description },
                                    }) => this.setState({ description })}
                                />
                                <FormHelperText id="description-helper-text">
                                    Descripción del sembrado (es opcional)
                                </FormHelperText>
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                variantColor="blue"
                                mr={3}
                                onClick={() => this.setState({ isOpen: false })}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={this.saveCell}
                                color="white"
                                backgroundColor="tomato"
                            >
                                Guardar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Fragment>
        );
    }
}
