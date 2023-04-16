import '../App.css';

import moment from 'moment';
// React
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
// Material
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip'
import { IconButton } from '@mui/material'
import Button from '@mui/material/Button';
// Ikony
import { BsFillGearFill } from "react-icons/bs";
// Axios
import Axios from 'axios';
const source = Axios.CancelToken.source();
const config = { cancelToken: source.token };
// Konstanty
const SERVER_BASE_URL = "http://localhost:4000";

const Dashboard = ({ public_tokens, units }) => {
    let unitsSign = '°C';
    let unitsTransfer = 1;
    let stations = [];
    // Stanice
    let [shownStation, setShownStation] = useState();
    let data = [];
    let [shownData, setShownData] = useState();
    // Filtry
    const [showFilterModal, setShowFilterModal] = useState(false);
    let setFilters = {
        start: moment(Date.now()).subtract(3, 'months').format('YYYY-MM-DD'),
        end: moment(Date.now()).format('YYYY-MM-DD'),
        granularity: 5 // 0 - 1 min, 1 - 5 min, 2 - 10 min, 3 - 30 min, 4 - 1 h, 5 - 1 den
    }
    // UseEffecty
    useEffect(() => {
        setUnitsVariables(units);
        // Získání přístupu ke stanicím
        checkStations();
    }, [])

    useEffect(() => {
        getData();
    }, [shownStation])
    // Axios Calls
    const _logDevice = async (data) => {
        try {
            return await Axios.get(SERVER_BASE_URL + "/devices/log-public", {
                headers: {
                },
                params: {
                    public_token: data.token,
                },
                config
            });
        } catch (error) {
            //throw new Error(error);
        }
    }

    const _getReportsByDates = async (data) => {
        if (shownStation === undefined) return;
        try {
            return await Axios.get(SERVER_BASE_URL + "/reports/get-by-dates", {
                headers: {
                    token: shownStation,
                },
                params: {
                    start: data.start,
                    end: data.end,
                    granularity: Number(data.granularity)
                },
                config
            });
        } catch (error) {
            //throw new Error(error);
        }
    }
    // Funkce
    function setUnitsVariables(unit) {
        if (unit === undefined) return;

        if (unit.toUpperCase() === 'FAHRENHEIT') {
            unitsSign = '°F';
            unitsTransfer = 33.8;
        }
    }

    async function checkStations() {
        if (public_tokens === undefined || public_tokens.length <= 0) return;

        for (let i = 0; i < public_tokens.length; i++) {
            let temp = (await _logDevice({ token: public_tokens[i] })).data[0];

            if (temp != undefined) {
                stations.push(temp.token);

                if (i === 0) setShownStation(temp.token);
            }
        }
    }

    function changeFilters(data, dateChanged) {
        setFilters = data;

        if (dateChanged) {
            getData();
            return;
        }

        filterData();
    }

    async function getData() {
        // Ověření
        chechGranularity();
        // Získání dat
        data = await _getReportsByDates(setFilters);
        console.log(data)
        // Vyfiltrování
        filterData();
    }

    function chechGranularity() {
        const timeDiff = moment.duration(moment(setFilters.end).diff(setFilters.start)).asDays();

        if (timeDiff <= 1 && setFilters.granularity != 0) {
            setFilters.granularity = 0;
        }

        if (timeDiff > 1 && timeDiff <= 3 && setFilters.granularity != 1) {
            setFilters.granularity = 1;
        }

        if (timeDiff > 3 && timeDiff <= 7 && setFilters.granularity != 2) {
            setFilters.granularity = 2;
        }

        if (timeDiff > 7 && timeDiff <= 14 && setFilters.granularity != 3) {
            setFilters.granularity = 3;
        }

        if (timeDiff > 14 && timeDiff <= 30 && setFilters.granularity != 4) {
            setFilters.granularity = 4;
        }

        if (timeDiff > 30 && timeDiff <= 90 && setFilters.granularity != 5) {
            setFilters.granularity = 5;
        }

        if (timeDiff > 90) {
            setFilters.granularity = 5;
            setFilters.start = moment(setFilters.end).subtract(90, 'days').format('YYYY-MM-DD');
        }
    }

    function filterData() {
        //
        if (setFilters.granularity === 0) {
            //
        }
    }

    function downsample() {
        //
    }

    return (
        <>
            <div className='dashboard-container'>
                {/* Horní bar */}
                <div className='row dashboard-header mx-auto'>
                    <div className='col-sm-12 col-md-12 col-lg-11'>
                        <h3> <b> Měření teploty </b> </h3>
                    </div>
                    <div className='dashboard-header-controls col-sm-12 col-md-12 col-lg-1'>
                        <Tooltip title={"Nastavit filtry"} placement='left'>
                            <IconButton onClick={() => { setShowFilterModal(!showFilterModal) }}>
                                <BsFillGearFill />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                {/* Tělo */}
                <div className='row dashboard-body'>
                    <p> Aktuální teplota: </p>
                    <p> Aktuální vlhkost: </p>
                </div>
            </div>

            <Filter show={showFilterModal} data={setFilters} handleClose={() => { setShowFilterModal(false) }} change={changeFilters} />
        </>
    )
};


const Filter = ({ show, data, handleClose, change }) => {
    const [start, setStart] = useState(data.start);
    const [end, setEnd] = useState(data.end);
    const [granularity, setGranularity] = useState(data.granularity);
    const [dateChanged, setDateChanged] = useState(false)
    // Možnosti v Selectech
    const granularityOptions = [{ value: 0, label: "1 minuta" }, { value: 1, label: "5 minut" }, { value: 2, label: "10 minut" }, { value: 3, label: "30 minut" }, { value: 4, label: "1 hodina" }, { value: 5, label: "1 den" }]
    // UseEffecty
    useEffect(() => {
        setDateChanged(false)
    }, [show])
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
                <Modal.Title> Nastavení filtrů  </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='row'>
                    <div className='col-sm-12 col-md-6 col-lg-6'>
                        <TextField
                            id="date"
                            label="Od kdy"
                            type="date"
                            defaultValue={data.start}
                            onChange={(e) => { setStart(e.target.value); setDateChanged(true); }}
                            sx={{ width: 220 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                    <div className='col-sm-12 col-md-6 col-lg-6'>
                        <TextField
                            id="date"
                            label="Do kdy"
                            type="date"
                            defaultValue={data.end}
                            onChange={(e) => { setEnd(e.target.value); setDateChanged(true); }}
                            sx={{ width: 220 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                </div>
                <div className='new-line'></div>
                <div className='row'>
                    <div className='col-sm-12 col-md-12 col-lg-6'>
                        <div className='col'>
                            <label> Granularita: </label>
                            <Select
                                aria-labelledby="aria-label"
                                inputId="aria-example-input"
                                name="aria-live-color"
                                placeholder="Vyberte granularitu..*"
                                defaultValue={granularityOptions[data.granularity]}
                                onChange={(selected) => { setGranularity(selected.value); }}
                                options={granularityOptions} />
                        </div>
                    </div>
                </div>
                <div className='new-line'></div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="contained"
                    onClick={() => { change({ start: start, end: end, granularity: granularity }, dateChanged); handleClose(); }}
                >
                    Nastavit filtry
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Dashboard;