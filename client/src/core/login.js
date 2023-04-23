import '../App.css';

import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ReactSession } from 'react-client-session';
// Material
import Button from '@mui/material/Button';
// Helpery
import Title from '../helpers/title';
import Footer from '../helpers/footer';
import { _EMAIL_REGEX } from '../helpers/const';
// Komponenty

// Axios Calls
import { _loginUser } from '../axiosCalls/user';
// Konstanty
ReactSession.setStoreType("localStorage");

const token = ReactSession.get("meteostanice-token");
const user = ReactSession.get("meteostanice-user");

const Login = () => {
    const navigate = useNavigate();
    let firstEmail = true;
    // Formulář
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(1);
    // Chyby pro formulář
    const [emailErr, setEmailErr] = useState(false);
    const [pwdErr, setPwdErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        if (token != undefined && user != undefined) {
            navigate("/");
            return
        }
    }, [])

    useEffect(() => {
        const ver = _EMAIL_REGEX.test(email);

        if ((email === "" && firstEmail) || (!ver && !firstEmail)) {
            firstEmail = false;
            setEmailErr(true);
        } else {
            setEmailErr(false);
        }
    }, [email])

    useEffect(() => {
        if (password === "") {
            setPwdErr(true);
        } else {
            setPwdErr(false);
        }
    }, [password])

    async function login() {
        try {
            let response = await _loginUser({
                email: email,
                password: password,
            });

            ReactSession.set("meteostanice-token", response.data[0].token);
            response.data[0].token = undefined;
            setUsers(response.data[0], true);
        } catch (error) {
            setErrMsg('Uživatel s daným email a heslem neexistuje!');
        }
    }

    const setUsers = (user, log) => {
        if (log) {
            ReactSession.set("meteostanice-user", user);
            navigate("/");
            window.location.reload(false);
        }
    }

    return (
        <>
            <Title title={'Přihlásit se'} />
            <div className="card card-signin my-5 col-sm-12 col-md-12 col-lg-4 mx-auto">
                <div className="card-body" id="reg">
                    <h2> Přihlášení </h2>
                    <div className='new-line'></div>
                    <form>
                        <div className="form-group">
                            <label> E-mail </label>
                            <input
                                type="text"
                                className={emailErr && !firstEmail ? "form-control is-invalid" : "form-control"}
                                autoComplete='off'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required />
                        </div>
                        <div className='new-line'></div>
                        <div className="form-group">
                            <label> Heslo </label>
                            <input
                                type="password"
                                className={pwdErr ? "form-control is-invalid" : "form-control"}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                            <div className='new-line'></div>
                            <span className={errMsg ? "help-block red" : "white"}> {errMsg} </span>
                        </div>
                        <div className='new-line'></div>
                        <div className="form-group">
                            <Button variant="contained" onClick={login}> Přihlásit se </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className='space'></div>
            <Footer />
            <Outlet />
        </>
    )
};

export default Login;