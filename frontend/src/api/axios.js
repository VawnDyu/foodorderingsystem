import axios from 'axios';

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend server address
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;