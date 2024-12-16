import axios from 'axios';

const api = axios.create({
    baseURL: 'https://campus-project-ljun.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api; 