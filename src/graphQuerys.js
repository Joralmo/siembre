import gql from 'graphql-tag';
const GET_EMAILS = gql`
    query email {
        users {
            email
        }
    }
`;

const NEW_TRAY = gql`
    mutation(
        $userId: String!
        $rows: Int!
        $columns: Int!
        $nombre: String!
        $createdAt: timestamp
    ) {
        insert_trays(
            objects: {
                user_id: $userId
                rows: $rows
                columns: $columns
                name: $nombre
                createdAt: $createdAt
            }
            on_conflict: { constraint: trays_pkey, update_columns: createdAt }
        ) {
            returning {
                id
            }
        }
    }
`;

const NEW_CELLS = gql`
    mutation($cells: [cells_insert_input!]!) {
        insert_cells(
            objects: $cells
            on_conflict: { constraint: cells_pkey, update_columns: createdAt }
        ) {
            affected_rows
        }
    }
`;

const GET_TRAY_BY_ID = gql`
    query getTrayById($trayId: Int!) {
        trays_by_pk(id: $trayId) {
            name
            rows
            columns
            cells(order_by: { posX: asc, posY: asc }) {
                id
                posX
                posY
                description
                createdAt
                updatedAt
                plant_id
                plant {
                    name
                }
            }
        }
    }
`;

const UPDATE_CELL = gql`
    mutation updateCell($id: Int!, $cell: cells_set_input) {
        update_cells(where: { id: { _eq: $id } }, _set: $cell) {
            affected_rows
        }
    }
`;

const GET_TRAYS = gql`
    query getTrays {
        trays(order_by: { createdAt: desc }) {
            createdAt
            id
            name
            rows
            columns
        }
    }
`;

const NEW_PLANT = gql`
    mutation($plant: [plant_insert_input!]!) {
        insert_plant(
            objects: $plant
            on_conflict: {
                constraint: plant_name_key
                update_columns: createdAt
            }
        ) {
            affected_rows
        }
    }
`;

const GET_PLANTS = gql`
    query getPlants {
        plant {
            id
            name
        }
    }
  
`;

export {
    GET_EMAILS,
    NEW_TRAY,
    NEW_CELLS,
    GET_TRAY_BY_ID,
    UPDATE_CELL,
    GET_TRAYS,
    NEW_PLANT,
    GET_PLANTS
};
