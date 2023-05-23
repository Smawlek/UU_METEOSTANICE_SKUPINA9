import '../App.css';
// React
import { useEffect, useState } from 'react';
import { ReactSession } from 'react-client-session';
// Helpery
import Title from '../helpers/title';
import Footer from '../helpers/footer';
// Komponenty
import Dashboard from '../components/dashboard';
// Axios Calls
import { _listUsersLocations } from '../axiosCalls/locations';
// Konstanty
ReactSession.setStoreType("localStorage");

const user = ReactSession.get("meteostanice-user");

const Home = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => {

        getPublicTokens();
    }, []);

    async function getPublicTokens() {
        let arr = [];
        const temp = (await _listUsersLocations()).data;

        for (let i = 0; i < temp.length; i++) {
            arr.push(temp[i].publicToken);
        }

        setStations(arr);
    }

    return (
        <>
            <Title title='Domovská stránka' />
            <div className='container'>
                <div className='card border-0 shadow my-5'>
                    <div className='card-body p-5'>
                        <h1> <u> <b> Vítejte na stránce Meteostanice </b> </u> </h1>
                        <div className='new-line'></div>
                        {user != undefined ? stations.length <= 0 ?
                            <div className="col-sm-12 col-md-12 col-lg-12 mx-auto search-result"> <p> <b> DATA SE NAČÍTAJÍ </b> </p> </div> :
                            <Dashboard public_keys={stations} /> :
                            <>
                                <h3> Pokud chcete zobrazit teploty pro vaše lokace, musíte se přihlásit </h3>
                            </>}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
};

export default Home;