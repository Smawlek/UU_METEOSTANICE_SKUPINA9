import '../App.css';
// React
import { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
// Material
import Button from '@mui/material/Button';
// Axios Calls
import { _changeLocationsPublicToken } from '../axiosCalls/locations';

const PublicTokenModal = ({ public_token, location_id, show, handleClose }) => {
    const [token, setToken] = useState(public_token);

    async function changeToken() {
        setToken((await _changeLocationsPublicToken({location: location_id})).data.publicToken);
    }

    return (
        <>
            <Modal
                show={show}
                size="lg"
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title> Zobrazení veřejného klíče  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> <b> Aktuální veřejný klíč: </b> {token} </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="contained"
                        onClick={() => { changeToken(); }}
                    >
                        Změnit veřejný klíč
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PublicTokenModal;