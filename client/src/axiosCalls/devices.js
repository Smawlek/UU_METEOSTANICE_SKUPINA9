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

export const _listUsersDevices = async () => {
    try {
        return await Axios.get(SERVER_BASE_URL + "/devices/list-users", {
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