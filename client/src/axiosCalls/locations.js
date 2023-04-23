import Axios from 'axios';

import { ReactSession } from 'react-client-session';
import { SERVER_BASE_URL } from '../helpers/const';

ReactSession.setStoreType("localStorage");

const token = ReactSession.get("meteostanice-token");
const source = Axios.CancelToken.source();

const config = {
    cancelToken: source.token
}

export const _endUserQueries = () => {
    source.cancel();
}

export const _listUsersLocations = async () => {
    try {
        return await Axios.get(SERVER_BASE_URL + "/locations/list-users", {
            headers: {
                token: token
            },
            params: {
                // Bez parametrů
            },
            config
        });
    } catch (error) {
        throw new Error(error)
    }
}

export const _changeLocationsPublicToken = async (data) => {
    try {
        console.log(data.location)
        return await Axios.get(SERVER_BASE_URL + "/locations/change-public-token", {
            headers: {
                token: token
            },
            params: {
                location: data.location
            },
            config
        });
    } catch (error) {
        throw new Error(error)
    }
}