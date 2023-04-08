import '../App.css';
// React
import { useEffect, useState } from 'react';

const Dashboard = () => {

    function checkStations() {
        //
    }

    return (
        <>
            <div className='dashboard-container'>
                {/* Horní bar */}
                <div className='row dashboard-header mx-auto'>
                    <div className='col-sm-12 col-md-12 col-lg-8'>
                        <h3> <b> Měření teploty </b> </h3>
                    </div>
                    <div className='dashboard-header-controls col-sm-12 col-md-12 col-lg-4'>
                        <p> Tady bude ovládání </p>
                    </div>
                </div>
                {/* Tělo */}
                <div className='row dashboard-body'>
                    <p> Aktuální teplota: </p>
                    <p> Aktuální vlhkost: </p>
                </div>
            </div>
        </>
    )
};

export default Dashboard;