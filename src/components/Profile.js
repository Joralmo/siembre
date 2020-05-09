import React, { Component } from 'react';
import { Auth0Context } from '../react-auth0-spa';

export default class Profile extends Component {
    static contextType = Auth0Context;
    render() {
        const { user } = this.context;
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#1a202c'
                }}
            >
                <div className="card-container">
                    <div className="upper-container">
                        <div className="image-container">
                            <img alt="Foto de perfil" src={user.picture} />
                        </div>
                    </div>

                    <div className="lower-container">
                        <div>
                            <h3>{user.name}</h3>
                            <h2 className="nick">{user.nickname}</h2>
                            <h4>Make it better</h4>
                        </div>
                        <div>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <a href="#" className="btn">
                                Actualizar datos
                            </a>
                        </div>
                    </div>
                </div>
                {/* <code>{JSON.stringify(user, null, 2)}</code> */}
            </div>
        );
    }
}