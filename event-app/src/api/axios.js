import axios from 'axios';

const api = axios.create({
    baseURL: 'https://campus-project-back-end.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api; 