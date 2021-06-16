import React, { useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import LoginModal from '../auth/LoginModal';
import styles from './Splash.module.css';

function Splash() {
    const history = useHistory();
    const [showLogin, setShowLogin] = useState(false);
    const user = useSelector(state => state.session.user);

    if (user) {
        history.push('/photos');
    }

    const login = () => {
        history.push('/login');
    }

    const signup = () => {
        history.push('/sign-up');
    }

    return (
        <div className={styles.page__container}>
            <div className={styles.splash__container}>
                <h1 className={styles.splash__message}>Welcome to Postacard where you create postcards from photos!</h1>
                <h1 className={styles.login_signup__container}>
                    <Button onClick={() => setShowLogin(true)} className={styles.login__link}>
                        Login
                    </Button>
                    <span> or </span>
                    <Button className={styles.signup__link}>
                        Sign Up
                    </Button>
                </h1>
            </div>
            <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
        </div>
    );
}

export default Splash;
