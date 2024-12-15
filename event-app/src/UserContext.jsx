import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'https://campus-project-ljun.onrender.com';  // Always use deployed backend
axios.defaults.withCredentials = true;

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Check if we have a token and try to get user data
        axios.get('/profile').then(({data}) => {
            setUser(data);
            setReady(true);
        }).catch(() => {
            setReady(true);
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
