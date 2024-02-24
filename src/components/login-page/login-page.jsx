import { useState, useRef, useContext } from 'react';
import styles from './login-page.module.scss';
import { NumContext } from '../services/page-context.js';

const LoginPage = () => {
    const { setMainVisible, setLoginVisible, loginVisible } = useContext(NumContext);
    const [validationError, setValidationError] = useState(false);

    const login = useRef();
    const password = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login.current.value === 'artem' && password.current.value === 'zalevsky') {
            setLoginVisible(false);
            setMainVisible(true);
        } else {
            setValidationError(true);
            setTimeout(() => {
                setValidationError(false);
            }, 2000)
        }
    };

    return (
        <>
            <div className={`${styles.login_page} ${loginVisible ? '' : styles.hidden}`}>
                <span className={styles.login_page_title}>ChatGPT</span>
                <div className={styles.login_page__window}>
                    <h1>Login Form</h1>
                    <form className={styles.login_page__window_form} onSubmit={handleSubmit}>
                        <input type='text' placeholder='Login' ref={login} className={`${validationError ? styles.error : ''}`}></input>
                        <div>
                            <input type='password' placeholder='Password' ref={password} className={`${validationError ? styles.error : ''}`}></input>
                            <div className={`${styles.text_error} ${validationError ? '' : styles.disapear}`}>Error</div>
                        </div>
                        <button type='submit' className={styles.login_page__window_btn}>Sign in</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginPage
