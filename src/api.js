import axios from "axios";

const client = axios.create({
    baseURL : "https://meddata-backend.onrender.com",
    timeout : 7000
})

export default client;