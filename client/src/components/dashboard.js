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
// Rechart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LabelList } from 'recharts';
// Ikony 
import { BsFillGearFill } from "react-icons/bs";
import { FiRefreshCcw } from "react-icons/fi";
// Axios
import Axios from 'axios';
const source = Axios.CancelToken.source();
const config = { cancelToken: source.token };
// Konstanty
const SERVER_BASE_URL = /*"http://localhost:4000" */"https://testing-heroku-dobest.herokuapp.com";
// Ostatní proměnné
let setFilters = {
    start: moment(Date.now()).subtract(2, 'days').format('YYYY-MM-DD'),
    startTime: '00:00',
    end: moment(Date.now()).format('YYYY-MM-DD'),
    endTime: '23:59',
    granularity: 4 // 0 - 1 min, 1 - 5 min, 2 - 10 min, 3 - 30 min, 4 - 1 h, 5 - 1 den
}
let stations = [];
let unitsSign = '°C';
let unitsTransfer = 1;
let called = false;

const Dashboard = ({ public_tokens, units }) => {
    // Stanice
    const [shownStation, setShownStation] = useState();
    const [shownStationName, setShownStationName] = useState();
    const [data, setData] = useState([]);
    const [shownData, setShownData] = useState("");
    const [temp, setTemp] = useState(0);
    const [humid, setHumid] = useState(0);
    // Filtry
    const [showFilterModal, setShowFilterModal] = useState(false);
    // UseEffecty
    useEffect(() => {
        called = true;
        // Nastavení jednotek
        setUnitsVariables(units);
        // Získání přístupu ke stanicím
        checkStations();
    }, [])

    useEffect(() => {
        getData();
    }, [shownStation])

    useEffect(() => {
        if (data.length <= 0) {
            setShownData(data);
            return;
        }
        // Vyfiltrování
        filterData(data);
    }, [data])
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
                    start: data.start + " " + data.startTime + ":00",
                    end: data.end + " " + data.endTime + ":59",
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
        let arr = [];

        if (public_tokens === undefined || public_tokens.length <= 0) return;

        for (let i = 0; i < public_tokens.length; i++) {
            let temp = (await _logDevice({ token: public_tokens[i] })).data[0];

            if (temp != undefined) {
                arr.push({ label: temp.location_name, value: temp.token });

                if (i === 0) {
                    setShownStation(temp.token);
                    setShownStationName(temp.location_name);
                }
            }
        }

        stations = arr;
    }

    function changeFilters(filter, dateChanged) {
        setFilters = filter;

        if (dateChanged) {
            getData();
            return;
        }

        filterData(data);
    }

    async function getData() {
        setShownData("");
        // Ověření
        chechGranularity();
        // Získání dat
        if (shownStation === undefined) return;
        const temp = (await _getReportsByDates(setFilters));
        setData(temp.data);
    }

    function chechGranularity() {
        const timeDiff = moment.duration(moment(setFilters.end).diff(setFilters.start)).asDays();

        if (timeDiff <= 1 && setFilters.granularity < 0) {
            setFilters.granularity = 0;
        }

        if (timeDiff > 1 && timeDiff <= 3 && setFilters.granularity < 1) {
            setFilters.granularity = 1;
        }

        if (timeDiff > 3 && timeDiff <= 7 && setFilters.granularity < 2) {
            setFilters.granularity = 2;
        }

        if (timeDiff > 7 && timeDiff <= 14 && setFilters.granularity < 3) {
            setFilters.granularity = 3;
        }

        if (timeDiff > 14 && timeDiff <= 30 && setFilters.granularity < 4) {
            setFilters.granularity = 4;
        }

        if (timeDiff > 30 && timeDiff <= 90 && setFilters.granularity < 5) {
            setFilters.granularity = 5;
        }

        if (timeDiff > 90) {
            setFilters.granularity = 5;
            setFilters.start = moment(setFilters.end).subtract(90, 'days').format('YYYY-MM-DD');
        }
    }

    async function filterData(arr) {
        let finalData = [];
        // granularita | 0 - 1 min, 1 - 5 min, 2 - 10 min, 3 - 30 min, 4 - 1 h, 5 - 1 den
        switch (setFilters.granularity) {
            case 0:
                finalData = await upsample(arr);
                break;
            case 1:
                finalData = await skip(arr, 1);
                break;
            case 2:
                finalData = await skip(arr, 2)
                break;
            case 3:
                finalData = await skip(arr, 6)
                break;
            case 4:
                finalData = await skip(arr, 12);
                break;
            case 5:
                finalData = await skip(arr, 12 * 24);
                break;
            default:
                break;
        }

        completeMissing(finalData);
    }

    function upsample(arr) {
        let finalArr = [];
        let divT = 0;
        let divH = 0;

        for (let i = 0; i < arr.length; i++) {
            // První
            finalArr.push({
                temperature: arr[i].temperature * unitsTransfer,
                humidity: arr[i].humidity,
                date: moment().format('YYYY-MM-DD HH:mm:SS')
            });
            // Kontrola zda není poslední
            if (i < arr.length - 1) {
                // Výpočet rozdílů
                divT = arr[i].temperature - arr[i + 1].temperature;
                divH = arr[i].humidity - arr[i + 1].humidity;
                // Přidání neznámých dat
                for (let j = 1; j <= 4; j++) {
                    finalArr.push({
                        temperature: (arr[i].temperature - j * (divT / 5)) * unitsTransfer,
                        humidity: arr[i].humidity - j * (divH / 5),
                        date: moment(arr[i].date).add(j, 'minutes').format('YYYY-MM-DD HH:mm:SS')
                    });
                }
            }
        }

        return finalArr
    }

    function skip(arr, every) {
        let fin = [];

        for (let i = 0; i < arr.length; i = i + every) {
            fin.push({
                temperature: arr[i].temperature * unitsTransfer,
                humidity: arr[i].humidity,
                date: moment(arr[i].date).format('YYYY-MM-DD HH:mm:SS')
            });
        }

        return fin;
    }

    function completeMissing(data) {
        let finalData = [];
        let i = 0;
        let actualDate = setFilters.start + " " + setFilters.startTime + ":00";
        let endDate = setFilters.end + " " + setFilters.endTime + ":00";
        let granPlus = setFilters.granularity === 0 ? 1 : setFilters.granularity === 1 ? 5 : setFilters.granularity === 2 ? 10 : setFilters.granularity === 3 ? 30 : setFilters.granularity === 4 ? 60 : 1440;
        endDate = moment(endDate).add(granPlus, 'minutes').format('YYYY-MM-DD HH:mm:SS');

        if (i < data.length && data[i].date == actualDate) {
            finalData.push({
                id_re: data[i].id_re,
                location_id: data[i].location_id,
                temperature: data[i].temperature,
                humidity: data[i].humidity,
                date: moment(data[i].date).format('HH:mm:SS DD.MM.YY')
            });
            i++;
        } else {
            finalData.push({
                id_re: 0,
                location_id: data[0].location_id,
                temperature: 0,
                humidity: 0,
                date: moment(actualDate).format('HH:mm:SS DD.MM.YY')
            });
        }
        
        while (actualDate <= endDate) {
            if (i < data.length && data[i].date == actualDate) {
                finalData.push({
                    id_re: data[i].id_re,
                    location_id: data[i].location_id,
                    temperature: data[i].temperature,
                    humidity: data[i].humidity,
                    date: moment(data[i].date).format('HH:mm:SS DD.MM.YY')
                });
                i++;
            } else {
                finalData.push({
                    id_re: 0,
                    location_id: data[0].location_id,
                    temperature: 0,
                    humidity: 0,
                    date: moment(actualDate).format('HH:mm:SS DD.MM.YY')
                });
            }

            actualDate = moment(actualDate).add(granPlus, 'minutes').format('YYYY-MM-DD HH:mm:SS');
        }

        setShownData(finalData);
        setTemp(finalData[finalData.length - 1].temperature);
        setHumid(finalData[finalData.length - 1].humidity);
    }

    return (
        <>
            <div className='dashboard-container'>
                {/* Horní bar */}
                <div className='row dashboard-header mx-auto'>
                    <div className='col-sm-12 col-md-12 col-lg-7'>
                        <h3> <b> Měření teploty - {shownStationName} </b> </h3>
                    </div>
                    <div className='col-sm-12 col-md-12 col-lg-3'>
                        {stations.length <= 1 ? '' :
                            <Select
                                aria-labelledby="aria-label"
                                inputId="aria-example-input"
                                name="aria-live-color"
                                placeholder="Vyberte stanici"
                                onChange={(selected) => { setShownStation(selected.value); setShownStationName(selected.label) }}
                                options={stations}
                            />
                        }
                    </div>
                    <div className='dashboard-header-controls col-sm-12 col-md-12 col-lg-1'>
                        <Tooltip title={"Obnovit"} placement='top'>
                            <IconButton onClick={() => { getData() }}>
                                <FiRefreshCcw />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className='dashboard-header-controls col-sm-12 col-md-12 col-lg-1'>
                        <Tooltip title={"Nastavit filtry"} placement='top'>
                            <IconButton onClick={() => { setShowFilterModal(!showFilterModal) }}>
                                <BsFillGearFill />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                {/* Tělo */}
                {shownData === "" ?
                    <div className="col-sm-12 col-md-12 col-lg-12 mx-auto search-result"> <p> <b> DATA SE NAČÍTAJÍ </b> </p> </div> :
                        <div className='row dashboard-body'>
                            <div className='col-sm-12 col-md-12 col-lg-5 mx-auto'>
                                <span> Aktuální teplota: {temp} {unitsSign}  |  Aktuální vlhkost: {humid} % </span>
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    maxWidth: "1000px",
                                    margin: "10px auto"
                                }}
                            >
                                <ResponsiveContainer height={300}>
                                    <LineChart data={shownData}>
                                        <XAxis dataKey="date" />
                                        <YAxis type="number" domain={[-50, 50]} />
                                        <CartesianGrid stroke="#eee" />
                                        <Legend />
                                        <Line type="monotone" name='Teplota' dataKey="temperature" stroke="#8884d8" isAnimationActive={false}>
                                            {setFilters.granularity > 3 ? <LabelList dataKey="temperature" position="top" /> : ""}
                                        </Line>
                                        <Line type="monotone" name='Vlhkost vzduchu' dataKey="humidity" stroke="#82ca9d" isAnimationActive={false}>
                                            {setFilters.granularity > 3 ? <LabelList dataKey="humidity" position="top" /> : ""}
                                        </Line>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                }
            </div>

            <Filter show={showFilterModal} data={setFilters} handleClose={() => { setShowFilterModal(false) }} change={changeFilters} />
        </>
    )
};


const Filter = ({ show, data, handleClose, change }) => {
    const [start, setStart] = useState(data.start);
    const [startTime, setStartTime] = useState(data.startTime);
    const [end, setEnd] = useState(data.end);
    const [endTime, setEndTime] = useState(data.endTime);
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
                    <h5> Od kdy </h5>
                    <div className='col-sm-12 col-md-6 col-lg-6'>
                        <TextField
                            id="date"
                            label="Datum"
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
                            label="Čas"
                            type="time"
                            defaultValue={data.startTime}
                            onChange={(e) => { setStartTime(e.target.value); setDateChanged(true); }}
                            sx={{ width: 220 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                </div>
                <div className='new-line'></div>
                <div className='row'>
                    <h5> Do kdy </h5>
                    <div className='col-sm-12 col-md-6 col-lg-6'>
                        <TextField
                            id="date"
                            label="Datum"
                            type="date"
                            defaultValue={data.end}
                            onChange={(e) => { setEnd(e.target.value); setDateChanged(true); }}
                            sx={{ width: 220 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                    <div className='col-sm-12 col-md-6 col-lg-6'>
                        <TextField
                            id="date"
                            label="Čas"
                            type="time"
                            defaultValue={data.endTime}
                            onChange={(e) => { setEndTime(e.target.value); setDateChanged(true); }}
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
                    onClick={() => { change({ start: start, startTime: startTime, end: end, endTime: endTime, granularity: granularity }, dateChanged); handleClose(); }}
                >
                    Nastavit filtry
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Dashboard;