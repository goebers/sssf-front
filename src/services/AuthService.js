import axios from 'axios';
import CookieService from './CookieService';

const cookies = new CookieService();

/** axios constants */
const BASE_URL = 'https://env-9926568.jelastic.metropolia.fi/';

class AuthService {
    // check if token is still valid and return a promise
     isLoggedIn() {
        const HEADERS = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'access-token': cookies.getCookie('token'),
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
            }
        };

        return axios.get(BASE_URL + 'users/validate', HEADERS);
    }
};

export default AuthService;
