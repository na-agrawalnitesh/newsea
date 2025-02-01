import axios from "axios"; 

const token = localStorage.getItem('token');

const instance = axios.create({
    
    baseURL : process.env.REACT_APP_API_URL,
    headers: {
        Authorization: token,
        // Content-Type: "application/json",
        timeout : 1000,
    }, 
});

export default instance;