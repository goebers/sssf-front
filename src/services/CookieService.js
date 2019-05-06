import Cookies from 'universal-cookie';

const cookies = new Cookies();

class CookieService {
    // get and return all cookies
    getAll() {
        return cookies.getAll();
    };

    // set new cookie
    setCookie(name, value, expiration) {
        const cookiesOptions = {
            path: '/',
            maxAge: expiration
        };

        cookies.set(name, value, cookiesOptions);
    };

    // get and return a single cookie
    getCookie(name) {
        return cookies.get(name);
    };

    removeCookie(name) {
        return cookies.remove(name, { path: '/' });
    }
};

export default CookieService;
