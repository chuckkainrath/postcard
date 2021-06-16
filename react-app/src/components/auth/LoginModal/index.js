import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from "react-router-dom";
import { Form, Button, Modal } from 'react-bootstrap';
import { login } from "../../../store/session";
import styles from './LoginModal.module.css';

const LoginModal = ({ showLogin, setShowLogin }) => {
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
    <Modal
      show={showLogin}
      onHide={() => setShowLogin(false)}
      dialogClassName={styles.modal__login}
      centered
    >
      <Modal.Body>
        <Form onSubmit={onLogin}>
          <h1>Login</h1>
          <div>
            {errors.map((error) => (
              <div>{error}</div>
            ))}
          </div>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={updateEmail}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={updatePassword}
            />
          </Form.Group>
          <Button variant="primary" type="submit">Login</Button>
        </Form>
        <div className={styles.login__other_options}>
            <div>Don't have an account?
              <a className={styles.redirect} onClick={() => history.push('/sign-up')}> Sign Up </a>
            </div>
          <div>Or login as a <a className={styles.redirect} onClick={() => signInAsDemo()}>DemoUser</a></div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
