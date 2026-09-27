import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Btn } from '@/components/ui/Btn/Btn';
import { Input } from '@/components/ui/Input/Input';

import './Auth.scss';

export default function AuthPage() {
    const navigate = useNavigate();
    const [idInstance, setIdInstance] = useState('');
    const [apiToken, setApiToken] = useState('');
    const checkAuth = async () => {
        try {
            const response = await fetch(
                `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiToken}`
            );

            const data = await response.json();

            console.log(data);

            if (data.stateInstance === 'authorized') {
                localStorage.setItem(
                    'idInstance',
                    idInstance
                );

                localStorage.setItem(
                    'apiTokenInstance',
                    apiToken
                );

                navigate('/main');
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <main className="auth">
            <div className="auth__card">
                <h1>ChatTGApi</h1>
                <p>Введите данные GREEN-API</p>
                <div className="auth__fields">
                    <Input value={idInstance} onChange={setIdInstance} placeholder="idInstance"/>
                    <Input value={apiToken} onChange={setApiToken} placeholder="apiTokenInstance"/>
                </div>
                <Btn onClick={checkAuth}>Войти</Btn>
            </div>
        </main>
    );
};