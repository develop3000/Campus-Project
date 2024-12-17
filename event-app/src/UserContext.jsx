import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'https://campus-project-back-end.onrender.com';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Check if we have a token and try to get user data
        axios.get('/profile', { withCredentials: true })
            .then(({data}) => {
                setUser(data);
                setReady(true);
            })
            .catch(() => {
                setReady(true);
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
