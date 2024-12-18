import axios, { AxiosError } from "axios";
import React, {useState} from "react";
import Cookies from "js-cookie";

const API_BASE_URL = "https://localhost:7089/api";
const ApiService = {
    Auth: async(login, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Account/Login?login=${login}&password=${password}`);
            return response.data;
        }
        catch (error){
            console.log(error);
        }
    },
    GetTasks: async(isCompleted) => {
        console.log('GetTasks > isCompleted: ' + isCompleted);
        const token = Cookies.get('authToken');
        console.log('token: ' + token);
        if (!token)
        {
            console.log('GetTasks > НЕ пройдена авторизация');
            return new AxiosError('Not Auth', 401);
        }
        console.log('GetTasks > пройдена авторизация');
        try {
            var link = `${API_BASE_URL}/Task/currentEmployee?IsCompleted=${isCompleted === null ? "" : isCompleted}`;
            console.log(link);
            console.log('выполняет запрос');
            const response = await axios.get(link, {
                headers:
                    { 'Authorization': `Bearer ${token}` }
            });
            return response;

        } catch (error){
            console.log('попал в catch');
            console.log(error);
            return error;
        }
    },
    PutTask: async(taskId, updateTask) => {
        try{
            console.log('вход в PutTask');
            var link = `${API_BASE_URL}/Task`;
            console.log(link);
            console.log(updateTask);
            const response = await axios.put(link, updateTask, {params: {taskId: taskId}});
        } catch (error){
            console.log(error);
        }
    },
    GetEmployees: async() => {
        try{
            const response = await axios.get(`${API_BASE_URL}/employee/all`);
            return response.data;
        } catch (error){
            console.log(error);
        }
    },
    PostTask: async(createTaskRequest) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/Task`, createTaskRequest);
            return response.data;
        } 
        catch(error)
        {
            console.log(`PostTask error: ${error}`);
        }
    },
}

export default ApiService;

