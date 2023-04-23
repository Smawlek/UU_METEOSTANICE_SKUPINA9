import '../App.css';
// React
import { useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import { useState, useEffect } from "react";
// Material
import Button from '@mui/material/Button';
// Helpery
import Title from '../helpers/title';
import Footer from '../helpers/footer';
// Komponenty
import PasswordChange from '../components/passwordChange';
// Axios Calls
import { _getUsersInfo } from '../axiosCalls/user';
// Konstanty
ReactSession.setStoreType("localStorage");

const user = ReactSession.get("meteostanice-user");
const token = ReactSession.get("meteostanice-token");

const Profile = () => {
    const navigate = useNavigate();
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [userInfo, setUserInfo] = useState();

    useEffect(() => {
        if(token === undefined || user === undefined) {
            navigate('/');
        }

        getData()
    }, [])

    async function getData() {
        setUserInfo((await _getUsersInfo()).data[0]);
    }

    return (
        <>
            <Title title='Profil' />
            <div className='container'>
                <div className='card border-0 shadow my-5'>
                    <div className='card-body p-5'>
                        <h1> <u> Profil uživatele {user.name} </u> </h1>
                        <div className='new-line'></div>
                        <div className='row'>
                            {userInfo === undefined ?
                                <div className="col-sm-12 col-md-12 col-lg-12 mx-auto search-result"> <p> <b> DATA SE NAČÍTAJÍ </b> </p> </div> :
                                <>
                                    <div className='col-sm-12 col-md-12 col-lg-6'>
                                        <ul className="list-group">
                                            <li className="list-group-item"> Email: {userInfo.email} </li>
                                            <li className="list-group-item"> Počet spravovaných zařízení: {userInfo.devices_count} </li>
                                        </ul>
                                    </div>

                                    <div className='col-sm-12 col-md-12 col-lg-6'>
                                        <ul className="list-group">
                                            <li className="list-group-item"> Role: {userInfo.role} </li>
                                            <li className="list-group-item"> Počet spravovaných lokací: {userInfo.locations_count} </li>
                                        </ul>
                                    </div>
                                </>
                            }
                        </div>
                        <div className='new-line'></div>
                        <Button variant="contained" onClick={() => { setShowPasswordChange(!showPasswordChange) }}> Změnit heslo </Button>
                    </div>
                </div>
            </div>
            <div className='space' />
            <PasswordChange show={showPasswordChange} handleClose={() => { setShowPasswordChange(false) }} />
            <Footer />
        </>
    )
};

export default Profile;