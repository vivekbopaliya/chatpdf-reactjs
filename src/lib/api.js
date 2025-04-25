import axios from "axios";

export const api = axios.create({
    baseURL: process.env.BACKEND_URL || "http://localhost:8000/api/v1", 

    withCredentials: true ,

});