import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Auth from './Auth/Auth';
import { MainLayout } from './Main/MainLayout';
import ChatPage from './Main/ChatPage';

const isAuthorized = () => {
    const idInstance = localStorage.getItem('idInstance');
    const apiTokenInstance = localStorage.getItem('apiTokenInstance');
    return Boolean(idInstance && apiTokenInstance);
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={isAuthorized() ? '/main' : '/auth'}
                            replace
                        />
                    }
                />
                <Route
                    path="/auth"
                    element={<Auth />}
                />
                <Route
                    path="/main"
                    element={
                        isAuthorized() ? (
                            <MainLayout />
                        ) : (
                            <Navigate
                                to="/auth"
                                replace
                            />
                        )
                    }
                >
                    <Route
                        index
                        element={
                            <div className='m-auto'>
                                Выберите чат
                            </div>
                        }
                    />
                    <Route
                        path=":chatId"
                        element={<ChatPage />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}