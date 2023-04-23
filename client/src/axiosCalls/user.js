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

export const _loginUser = async (data) => {
    try {
        return await Axios.get(SERVER_BASE_URL + "/users/login", {
            headers: {
                token: token
            },
            params: {
                email: data.email,
                password: data.password,
            },
            config
        });
    } catch (error) {
        throw new Error(error)
    }
}

export const _changeUsersPassword = async (data) => {
    try {
        return await Axios.post(SERVER_BASE_URL + '/users/change-password', 
        {
            old_pass: data.old_pass,
            new_pass: data.new_pass
        },
        {
            headers: {
                token: token
            }
        },
        config);
    } catch (error) {
        throw new Error(error)
    }
}

export const _getUsersInfo = async () => {
    try {
        return await Axios.get(SERVER_BASE_URL + "/users/get-info", {
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