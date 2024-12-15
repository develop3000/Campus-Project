import { createContext, useState, useEffect } from 'react';
import api from './api/axios';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Check if we have a token and try to get user data
        api.get('/profile').then(({data}) => {
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
