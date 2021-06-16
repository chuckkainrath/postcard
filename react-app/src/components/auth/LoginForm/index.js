import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'

import { login } from "../../../store/session";
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data.errors) {
      setErrors(data.errors);
    }
  };

  const signInAsDemo = async () => {
    const data = await dispatch(login('demo@aa.io', 'password'))
    if (data.errors) {
      setErrors(data.errors);
    }
  }

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/photos" />;
  }

  return (
    // <div className={styles.login_form__container}>
    <>
      <form className={styles.login_form} onSubmit={onLogin}>
        <h1>Login</h1>
        <div>
          {errors.map((error) => (
            <div>{error}</div>
          ))}
        </div>
        <div className={styles.input__container}>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={updateEmail}
          />
        </div>
        <div className={styles.input__container}>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={updatePassword}
          />
        </div>
        <button className={styles.submit__btn} type="submit">Login</button>
      </form>
      <div className={styles.other__options}>
          <div>Don't have an account?
            <span className={styles.redirect} onClick={() => history.push('/sign-up')}> Sign Up </span>
          </div>
        <div>or login as a <span className={styles.redirect} onClick={() => signInAsDemo()}>DemoUser</span></div>
      </div>
    </>
  );
};

export default LoginForm;
