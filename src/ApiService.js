import axios from "axios";
import React, {useState} from "react";

const API_BASE_URL = "https://localhost:7089/api";

const ApiService = {
    Auth: async(login, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Account/Login?login=${login}&password=${password}`);
            return response.data;
        } 
        catch (error){
            throw error;
        }
    },
}

export default ApiService;

