import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'https://campus-project-back-end.onrender.com';
axios.defaults.withCredentials = true;

export const UserContext = createContext();

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Check authentication status when component mounts
        const checkAuth = async () => {
            try {
                const { data } = await axios.get('/auth-status');
                if (data.authenticated) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
            } finally {
                setReady(true);
            }
        };

        checkAuth();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, ready }}>
            {children}
        </UserContext.Provider>
    );
}
