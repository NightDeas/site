import axios, { AxiosError } from "axios";
import React, {useState} from "react";
import Cookies from "js-cookie";

const API_BASE_URL = "https://localhost:7089/api";
const ApiService = {
    Auth: async(login, password) => {
        try {
            const loginRequest = {
                Login: login,
                Password: password
            };
            const response = await axios.post(`${API_BASE_URL}/Account/Login`, loginRequest,
             {
                headers:{
                   'Content-Type' : 'application/json'
                }
            });
            return response;
        }
        catch (error){
            console.log(error);
        }
    },
    GetTasks: async(isCompleted) => {
        const token = Cookies.get('authToken');
        if (!token)
        {
            return new AxiosError('Not Auth', 401);
        }
        try {
            var link = `${API_BASE_URL}/Task/currentEmployee?IsCompleted=${isCompleted === null ? "" : isCompleted}`;
            const response = await axios.get(link, {
                headers:
                    { 'Authorization': `Bearer ${token}` }
            });
            return response;

        } catch (error){
            console.log(error);
            return error;
        }
    },
        PutTask: async (taskId, updateTask) => {
        try {
            console.log('Вход в PutTask');
            const link = `${API_BASE_URL}/Task?taskId=${taskId}`;
            const token = Cookies.get('authToken');
    
            if (!token) {
                console.error('Токен авторизации отсутствует');
                throw new Error('Not Auth', 401);
            }
    
            var response = await axios.put(link, updateTask, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('PutTask response:', response);
            return response;
        } catch (error) {
            console.error('PutTask error:', error);
            return error;
        }
    },
     PutTaskIsComplete: async (taskId, isCompleted) => {
        try {
            const link = `${API_BASE_URL}/Task/taskCompleted`;
            const token = Cookies.get('authToken');
            
            if (!token) {
                console.error('PutTaskIsComplete Токен авторизации отсутствует');
                throw new Error('Not Auth', 401);
            }
            var request = {
                taskId: taskId,
                isCompleted: isCompleted
            };
            
            const response = await axios.put(link, request, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('PutTaskIsComplete response:', response);
            return response;
        } catch (error) {
            console.error('PutTaskIsComplete error:', error);
            return {
                success: false,
                error: error.response?.data || error.message || 'Произошла ошибка при выполнении запроса'
            };
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
            const token = Cookies.get('authToken');
            
            if (!token) {
                console.error('PostTask Токен авторизации отсутствует');
                throw new Error('Not Auth', 401);
            }
            console.log(createTaskRequest);
            var link = `${API_BASE_URL}/Task`;
                const response = await axios.post(link, createTaskRequest, {
                headers:{
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response;
        }
        catch(error)
        {
            console.log(`PostTask error: ${error}`);
            return error;
        }
    },
}

export default ApiService;

