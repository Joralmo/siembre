import React from 'react';
import { Query } from 'react-apollo';
import { GET_EMAILS } from './../graphQuerys';
import { Text } from '@chakra-ui/core';

const EmailList = () => (
    <Query query={GET_EMAILS}>
        {({ loading, data, error }) => {
            if (loading) {
                return <div>Loading. Please wait...</div>;
            }
            if (error) {
                return <code>{JSON.stringify(error, null, 2)}</code>;
            }
            data.users.map((user, index) => {
                console.log(user);
                return <Text>Hola</Text>;
            });
        }}
    </Query>
);

export default EmailList;
