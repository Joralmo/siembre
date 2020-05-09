import gql from 'graphql-tag';
const GET_EMAILS = gql`
    query email {
        users {
            email
        }
    }
`;

const NEW_TRAY = gql`
    mutation($userId: String!, $rows: Int!, $columns: Int!) {
        insert_trays(
            objects: { user_id: $userId, rows: $rows, columns: $columns }
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
            rows
            columns
            cells(order_by: {posX: asc, posY: asc}){
                id
                posX
                posY
                name
                description
                createdAt
                updatedAt
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

export { GET_EMAILS, NEW_TRAY, NEW_CELLS, GET_TRAY_BY_ID, UPDATE_CELL };
