import React from 'react';
import { useAuth0 } from '../react-auth0-spa';
import moment from "moment";
import "moment/locale/es";

const Profile = () => {
    moment.locale('es');
    const { loading, user } = useAuth0();

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <div className="card-container">
                <div className="upper-container">
                    <div className="image-container">
                        <img src={user.picture} />
                    </div>
                </div>

                <div className="lower-container">
                    <div>
                        <h3>{user.nickname}</h3>
                        <h4>Make it better</h4>
                    </div>
                    <div>
                        <p>
                            {user.email}
                        </p>
                    </div>
                    <div>
                        <a href="#" className="btn">
                            Actualizar datos
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
