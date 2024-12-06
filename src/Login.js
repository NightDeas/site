import React, { useState } from "react";
import ApiService from "./ApiService"
import Cookies from "js-cookie";
import {Navigate} from 'react-router-dom'

const Login  = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


const handleLogin = async (e) =>
    {
        e.preventDefault();
        try{
            const token = await ApiService.Auth(login, password);
            Cookies.set('authToken', token, {expires: 1})
            console.log(token);
            return <Navigate to="/Menu" replace={true}/>;
        }
        catch (err)
        {
            setError('Ошибка авторизации', err);
        }
    };

    return (
<div>
    <h2>Авторизация</h2>
    {error && <p style={{ color : 'red'}}>{error}</p>}
    <form onSubmit={handleLogin}>
        <div>
            <label>Логин</label>
            <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Пароль</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button type="submit">Войти</button>
    </form>
</div>
    );
};
export default Login; 