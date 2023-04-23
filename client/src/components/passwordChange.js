import '../App.css';
// React
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
// Material
import Button from '@mui/material/Button';
// Axios Calls
import { _changeUsersPassword } from '../axiosCalls/user';

const PasswordChange = ({ show, data, handleClose }) => {
    const [success, setSuccess] = useState(false);
    // Pro uložení info z formuláře
    const [pass, setPass] = useState(0);
    const [confPass, setConfPass] = useState(0);
    const [newPass, setNewPass] = useState(0);
    const [confNewPass, setConfNewPass] = useState(0);
    // Pro errory k formuláři
    const [passErr, setPassErr] = useState(false);
    const [confPassErr, setConfPassErr] = useState(false);
    const [newPassErr, setNewPassErr] = useState(false);
    const [confNewPassErr, setConfNewPassErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    // UseEffecty
    useEffect(() => {
        if (pass === "") {
            setPassErr(true);
        } else {
            setPassErr(false);
        }
    }, [pass])

    useEffect(() => {
        if (confPass === "" || (confPass != pass && confPass != 0)) {
            setConfPassErr(true);
        } else {
            setConfPassErr(false)
        }
    }, [confPass])

    useEffect(() => {
        if (newPass === "") {
            setNewPassErr(true);
        } else {
            setNewPassErr(false);
        }
    }, [newPass])

    useEffect(() => {
        if (confNewPass === "" || (confNewPass != newPass && confNewPass != 0)) {
            setConfNewPassErr(true);
        } else {
            setConfNewPassErr(false);
        }
    }, [confNewPass])

    useEffect(() => {
        setErrMsg('');
    }, [pass, confPass, newPass, confNewPass])

    function check() {
        if (pass === "" || pass === 0 ||
            confPass === "" || confPass === 0 ||
            newPass === "" || newPass === 0 ||
            confNewPass === "" || confNewPass === 0) {
            setErrMsg("Nejsou vyplněny všechny údaje");
            return;
        }

        if (pass != confPass || newPass != confNewPass) {
            setErrMsg("Hesla se neshodují");
            return;
        }

        send();
    }

    async function send() {
        let data = {
            old_pass: pass,
            new_pass: newPass,
        }

        if (await _changeUsersPassword(data)) {
            setSuccess(true);
        }
    }
    //
    return (
        <Modal
            show={show}
            size="lg"
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title> Změna hesla  </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success ? <div className="col-sm-12 col-md-12 col-lg-12 mx-auto search-result"> <p> <b> HESLO BYLO ÚSPĚŠNĚ ZMĚNĚNO </b> </p> </div> :
                    <>
                        <div className='row'>
                            <div className='col-sm-12 col-md-12 col-lg-6 margin-bottom'>
                                <label> Staré heslo: </label>
                                <input
                                    type="password"
                                    className={passErr ? "form-control is-invalid" : "form-control"}
                                    placeholder="Staré heslo"
                                    aria-describedby="basic-addon2"
                                    onChange={(e) => setPass(e.target.value)}></input>
                            </div>
                            <div className='col-sm-12 col-md-12 col-lg-6'>
                                <label> Staré heslo pro potvrzení: </label>
                                <input
                                    type="password"
                                    className={confPassErr ? "form-control is-invalid" : "form-control"}
                                    placeholder="Staré heslo pro potvrzení"
                                    aria-describedby="basic-addon2"
                                    onChange={(e) => setConfPass(e.target.value)}></input>
                            </div>
                        </div>

                        <div className='new-line'></div>
                        <div className='row'>
                            <div className='col-sm-12 col-md-12 col-lg-6 margin-bottom'>
                                <label> Nové heslo: </label>
                                <input
                                    type="password"
                                    className={newPassErr ? "form-control is-invalid" : "form-control"}
                                    placeholder="Nové heslo"
                                    aria-describedby="basic-addon2"
                                    onChange={(e) => setNewPass(e.target.value)}></input>
                            </div>
                            <div className='col-sm-12 col-md-12 col-lg-6'>
                                <label> Nové heslo pro potvrzení: </label>
                                <input
                                    type="password"
                                    className={confNewPassErr ? "form-control is-invalid" : "form-control"}
                                    placeholder="Nové heslo pro potvrzení"
                                    aria-describedby="basic-addon2"
                                    onChange={(e) => setConfNewPass(e.target.value)}></input>
                            </div>
                        </div>
                        <div className={errMsg ? 'new-line' : 'hidden'}></div>
                        <span className={errMsg ? "help-block red" : "help-block hidden"}> {errMsg} </span>
                        <div className={errMsg ? "new-line" : "hidden"}></div>
                    </>}
                <div className='new-line'></div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="contained"
                    onClick={() => { check(); }}
                >
                    Změnit heslo
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PasswordChange;