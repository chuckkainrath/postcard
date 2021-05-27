import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './Splash.module.css';

function Splash() {
    const history = useHistory();
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
            </div>
        </div>
    );
}

export default Splash;
