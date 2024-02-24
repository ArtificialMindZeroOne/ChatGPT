import { useState, useContext } from 'react';
import styles from './app.module.scss';
import LoginPage from '../login-page/login-page.jsx';
import MainPage from '../main-page/main-page.jsx';
import { NumContext } from '../services/page-context.js';

function App() {
    const [loginVisible, setLoginVisible] = useState(true);
    const [mainVisible, setMainVisible] = useState(false);

    return (
        <>
            <NumContext.Provider
                value={{
                    mainVisible, setMainVisible, loginVisible, setLoginVisible
                }}>
                <LoginPage />
                <MainPage />
            </NumContext.Provider>
        </>
    )
}

export default App
