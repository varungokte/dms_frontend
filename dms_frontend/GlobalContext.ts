import axios from 'axios'
import { decodeToken } from "react-jwt";

const Base_Url = "http://localhost:5500/api/"


const RegisterUser = async (data: object) => {
    try {
        const response = await axios.post(`${Base_Url}register`, data);
        return response;
    } catch (error) {
        throw error;
    }
}

const LoginUser = async (data: object) => {
    try {
        const response = await axios.post(`${Base_Url}login`, data);
        if (response.data.user) {
            localStorage.setItem('Beacon-DMS-token', response.data.user)
        }
        return response;
    } catch (error) {
        throw error;
    }
}

const isLoggedIn = () => {
    const token = localStorage.getItem('Beacon-DMS-token')
    if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
            return true;
        }
    }
    // localStorage.removeItem('Beacon-DMS-token')
    return false;
}

const useGlobalContext = () => {
    return {
        RegisterUser,
        LoginUser,
        isLoggedIn
    }
}

export default useGlobalContext;