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
    FormHelperText,
    Tooltip,
    Textarea,
    Select,
} from '@chakra-ui/core';
import PlantaSvg from '../assets/planta.svg';
import PlantaGrisSvg from '../assets/naturaleza.svg';
import { UPDATE_CELL, GET_PLANTS } from '../graphQuerys';
import makeQuery from '../apollo/apollo';
import _ from 'lodash';
import verifyError from '../utils/verifyError';
import { Auth0Context } from '../react-auth0-spa';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es';

const Cell = ({ children, ...props }) => {
    const { cell, imagen, parent, fn } = { ...props };
    if (cell.description) {
        return (
            <Tooltip
                hasArrow
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

const Plants = ({ ...props }) => {
    const { plants } = { ...props };
    return plants.map((e) => (
        <option key={e.id} value={e.id}>
            {e.name}
        </option>
    ));
};

export default class Bandeja extends Component {
    static contextType = Auth0Context;
    constructor(props) {
        moment.locale('es');
        super(props);

        this.state = {
            rows: props.rows,
            columns: props.columns,
            cellActual: {},
            isOpen: false,
            plant_id: 0,
            name: null,
            description: null,
            plants: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.rows !== this.props.rows) {
            this.setState({ rows: nextProps.rows });
        } else if (nextProps.columns !== this.props.columns) {
            this.setState({ columns: nextProps.columns });
        }
    }

    async componentDidMount() {
        const operation = {
            query: GET_PLANTS,
        };
        const { data, errors } = await makeQuery(operation);
        if (errors) {
            verifyError(errors, this.context.loginWithRedirect);
            return;
        }
        this.setState({ plants: data.plant });
    }

    setCell = (cellActual) => {
        if (cellActual !== false)
            this.setState({
                cellActual,
                isOpen: true,
                plant_id: cellActual.plant_id,
                description: cellActual.description,
            });
    };

    saveCell = async () => {
        const { cellActual, plant_id, description, name } = this.state;
        if (plant_id !== 0) {
            const operation = {
                query: UPDATE_CELL,
                variables: {
                    id: cellActual.id,
                    cell: {
                        plant_id,
                        description,
                        updatedAt: moment().format(),
                    },
                },
            };
            const { errors } = await makeQuery(operation);
            if (errors) {
                verifyError(errors, this.context.loginWithRedirect);
                return;
            }
            cellActual.plant_id = plant_id;
            if (name) cellActual.plant = { name };
            cellActual.description = description;
            this.setState({ isOpen: false, plant_id: null, name: null });
        }
    };

    render() {
        const { rows, columns, cellActual, plants, plant_id } = this.state;
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
                                imagen = cell.plant ? PlantaSvg : PlantaGrisSvg;
                            } else {
                                cell = false;
                                imagen = PlantaSvg;
                            }
                            return (
                                <Box
                                    overflow="hidden"
                                    className="celda"
                                    key={`${i}${j}`}
                                    w={`${boxWidth}px`}
                                    h={`${boxHeight}px`}
                                    bg="blue.500"
                                    backgroundColor="transparent"
                                    display={
                                        parent === 'ver' ? 'block' : 'flex'
                                    }
                                    justifyContent="center"
                                    cursor="pointer"
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
                                    {cell && cell.plant && (
                                        <Tooltip
                                            hasArrow
                                            label={cell.plant.name}
                                            placement="bottom"
                                            bg="black"
                                        >
                                            <Text
                                                overflow="hidden"
                                                width="100%"
                                                whiteSpace="nowrap"
                                                textOverflow="ellipsis"
                                                m="0"
                                                p="0"
                                                color="white"
                                                fontWeight="bold"
                                                mt="-5px"
                                            >
                                                {cell.plant.name}
                                            </Text>
                                        </Tooltip>
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
                            {!plants.length && (
                                <Text color="black">
                                    Parece que no tienes plantas creadas,{' '}
                                    <Link
                                        to="/dashboard/plants/create"
                                        style={{ color: 'tomato' }}
                                    >
                                        Crea algunas aquí
                                    </Link>
                                </Text>
                            )}
                            <FormControl>
                                <FormLabel htmlFor="name">Nombre</FormLabel>
                                <Select
                                    onChange={(e) => {
                                        this.setState({
                                            plant_id: e.target.value,
                                            name:
                                                e.target.options[
                                                    e.target.options
                                                        .selectedIndex
                                                ].text,
                                        });
                                    }}
                                    defaultValue={plant_id}
                                >
                                    <option value="0">
                                        Nombre de la planta
                                    </option>
                                    <Plants plants={plants} />
                                </Select>
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
                                isDisabled={!plant_id}
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
