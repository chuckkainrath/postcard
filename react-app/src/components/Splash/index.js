import React, { useState } from 'react';
import { useHistory, NavLink, Redirect } from 'react-router-dom';
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

    return (
        <div className={styles.page__container}>
            <div className={styles.splash__container}>
                <h1 className={styles.splash__message}>Welcome to Postacard where you<br /> create postcards from photos!</h1>
                <h1 className={styles.login_signup__container}>
                    <Button onClick={() => setShowLogin(true)}>
                        Login
                    </Button>
                    <span> or </span>
                    <Button onClick={() => history.push('/sign-up')}>
                        Sign Up
                    </Button>
                </h1>
            </div>
            <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
        </div>
    );
}

export default Splash;
