import '../App.css';
// React
import { useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import { useState, useEffect } from "react";
// Material
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
// Bootstrap
import Modal from 'react-bootstrap/Modal';
// Helpery
import Title from '../helpers/title';
import Footer from '../helpers/footer';
// Komponenty
import Dashboard from '../components/dashboard';
// Ikony 
import { FaCircle } from "react-icons/fa";
import { TbPlugConnected } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { BiHash } from "react-icons/bi";
import { IoIosConstruct } from "react-icons/io";
// Axios Calls
import { _getUsersInfo } from '../axiosCalls/user';
import { _listUsersDevices } from '../axiosCalls/devices';
import { _listUsersLocations } from '../axiosCalls/locations';
import PublicTokenModal from '../components/publicTokenModal';
// Konstanty
ReactSession.setStoreType("localStorage");

const user = ReactSession.get("meteostanice-user");
const token = ReactSession.get("meteostanice-token");

const Management = () => {
    const navigate = useNavigate();
    const [showDevices, setShowDevices] = useState(true);
    const [data, setData] = useState();
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        if (token === undefined || user === undefined) {
            navigate('/');
        }

        getData();
    }, []);

    useEffect(() => {
        getData();
    }, [showDevices])

    async function getData() {
        setData(showDevices ? (await _listUsersDevices()).data : (await _listUsersLocations()).data)
    }

    return (
        <>
            <Title title={showDevices ? 'Správa zařízení' : 'Správa lokací'} />
            <div className='container'>
                <div className='card border-0 shadow my-5'>
                    <div className='card-body p-5'>
                        <h1> <u> Správa {showDevices ? 'zařízení' : 'lokací'} </u> </h1>
                        <div className='new-line ' />
                        <div className='row'>
                            <div className="col-sm-12 col-md-6 col-lg-6 mx-auto">
                                <button
                                    type="button"
                                    className="btn btn-success btn-lg col-sm-12 col-md-12 col-lg-12"
                                    disabled={showDevices}
                                    onClick={() => { setShowDevices(true) }}>
                                    Správa zařízení
                                </button>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 mx-auto">
                                <button
                                    type="button"
                                    className="btn btn-success btn-lg col-sm-12 col-md-12 col-lg-12"
                                    disabled={!showDevices}
                                    onClick={() => { setShowDevices(false) }}>
                                    Správa lokací
                                </button>
                            </div>
                        </div>
                        <div className='line-divider' />
                        <div className='row'>
                            <div className='col-sm-0 col-md-11 col-lg-11' />
                            <div className='col-sm-12 col-md-1 col-lg-1'>
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={(e) => { setShowAdd(!showAdd) }}>
                                    <AiOutlinePlus />
                                </button>
                            </div>
                        </div>
                        <div className='new-line' />
                        {data === undefined ? <div className="col-sm-12 col-md-12 col-lg-12 mx-auto search-result"> <p> <b> DATA SE NAČÍTAJÍ </b> </p> </div> :
                            data.length <= 0 ? <div className="col-sm-12 col-md-12 col-lg-12 mx-auto search-result"> <p> <b> ŽÁDNÉ VÝSLEDKY </b> </p> </div> :
                                data.map((val, i) => {
                                    if (showDevices) {
                                        return (
                                            <>
                                                <DevicesCard data={val} />
                                            </>
                                        )
                                    } else {
                                        return (
                                            <>
                                                <LocationsCard data={val} />
                                            </>
                                        )
                                    }
                                })
                        }
                    </div>
                </div>
            </div>
            <AddDevice show={showAdd} data={showDevices ? 'Spárování zařízení' : 'Přidání lokace'} handleClose={() => { setShowAdd(false) }} />
            <div className='space' />
            <Footer />
        </>
    )
};

const DevicesCard = ({ data }) => {
    return (
        <>
            <div className='linecard-div'>
                <div className='row'>
                    <div className='col-sm-12 col-md-12 col-lg-7 mx-auto linecard-div-content'>
                        <Tooltip placement='top' className='lesson_timetable_tooltip' title={data.isActive ? 'Stav aktivní' : 'Stav neaktivní'}>
                            <IconButton>
                                <FaCircle className={data.isActive ? 'green' : 'red'} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip placement='top' className='lesson_timetable_tooltip' title={data.isConnected ? 'Zařízení je spárované' : 'Zařízení není spárované'}>
                            <IconButton>
                                <TbPlugConnected className={data.isConnected ? 'green' : 'red'} />
                            </IconButton>
                        </Tooltip>
                        <b> Zařízení: </b> {data.device_name}
                    </div>
                </div>
            </div>
            <div className='new-line' />
        </>
    )
}

const AddDevice = ({ show, data, handleClose }) => {
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
                    <Modal.Title> {data}  </Modal.Title>
                </Modal.Header >
                <Modal.Body>
                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto search-result"> <p> <b> <IoIosConstruct /> STRÁNKA JE VE VÝVOJI </b> </p> </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="contained"
                        onClick={() => { handleClose(); }}
                    >
                        Zavřít okno
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

const LocationsCard = ({ data }) => {
    const [show, setShow] = useState(0);
    return (
        <>
            <div className='linecard-div'>
                <div className='row'>
                    <div className='col-sm-12 col-md-5 col-lg-3 mx-auto linecard-div-content'>
                        <b> Název: </b> {data.name}
                    </div>
                    <div className='col-sm-12 col-md-7 col-lg-5 mx-auto linecard-div-content'>
                        <b> Zařízení: </b> {data.device_name}
                    </div>
                    <div className='col-sm-12 col-md-12 col-lg-2 mx-auto linecard-div-content'>
                        <Tooltip placement='top' className='lesson_timetable_tooltip' title={'Zobrazit graf teploty a vlhkosti vzduchu'}>
                            <IconButton onClick={() => { show === 1 ? setShow(0) : setShow(1) }}>
                                <BsGraphUp />
                            </IconButton>
                        </Tooltip>
                        <Tooltip placement='top' className='lesson_timetable_tooltip' title={'Zobrazit veřejný token'}>
                            <IconButton onClick={() => { show === 2 ? setShow(0) : setShow(2) }}>
                                <BiHash />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                {show === 1 ?
                    <>
                        <div className='line-divider' />
                        <Dashboard public_tokens={[data.publicToken]} />
                        <div className='new-line' />
                    </> : ''
                }
                <PublicTokenModal location_id={data.location_id} public_token={data.publicToken} show={show === 2} handleClose={() => {setShow(0)}} />
            </div>

            <div className='new-line' />
        </>
    )
}

export default Management;