import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';

const uri = 'https://siembre.herokuapp.com/v1/graphql';
const token = localStorage.getItem('siembreAppToken');
const link = new HttpLink({
    uri,
    headers: { authorization: token ? 'Bearer ' + token : '' },
});

function makeQuery (operation) {
    return makePromise(execute(link, operation));
}

export default makeQuery;
