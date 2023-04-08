import '../App.css';

import { Outlet } from "react-router-dom";
import { Helmet } from 'react-helmet';

// Helpers
import CookiesInfo from './cookiesInfo';

const Title = (props) => {

    return (
        <>
            <Helmet>
                <title> {props.title} | METEOSTANICE </title>
                <style>{"body { background-color: rgba(3, 198, 252, 0.7); }"}</style>
            </Helmet>
            {/* <CookiesInfo /> */}
            <Outlet />
        </>
    )
};

export default Title;