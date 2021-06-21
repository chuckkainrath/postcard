import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from "react-router-dom";
import { Form, Button, Modal } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login } from "../../../store/session";
import styles from './LoginModal.module.css';

const LoginModal = ({ showLogin, setShowLogin }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [error, setError] = useState('');

  const onLogin = async values => {
    const data = await dispatch(login(values.email, values.password));
    if (data.errors) {
      setError('The email and password combination is invalid.');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  const signInAsDemo = async () => {
    const data = await dispatch(login('demo@aa.io', 'password'))
    if (data.errors) {
      setError('There was an issue with Demo Login.  Please try again.');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  }

  const hideLogin = () => {
    setShowLogin(false);
    setError('');
  }

  if (user) {
    return <Redirect to="/photos" />;
  }

  const initialValues = {
    email: '',
    password: ''
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required.'),
    password: Yup.string().required('Password is required')
  });

  return (
      <Modal
        show={showLogin}
        onHide={hideLogin}
        dialogClassName={styles.modal__login}
        centered
      >
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onLogin}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              isValid,
              errors,
              dirty
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className={styles.error__signin}>{error}</div>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.email && !errors.email}
                  />
                  <ErrorMessage name="email" component="span" className={styles.error__input} />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.password && !errors.password}
                  />
                  <ErrorMessage name="password" component="span" className={styles.error__input} />
                </Form.Group>
                <Button
                  className={!(dirty && isValid) ? styles.button__disable : ""}
                  disabled={!(dirty && isValid)}
                  variant="primary"
                  type="submit">
                    Login
                </Button>
              </Form>
            )}
          </Formik>
          <div className={styles.login__other_options}>
              <div>Don't have an account?
                <a tabindex='0' className={styles.redirect} onClick={() => history.push('/sign-up')}> Sign Up </a>
              </div>
            <div>Or login as a <a tabindex='0' className={styles.redirect} onClick={() => signInAsDemo()}>DemoUser</a></div>
          </div>
        </Modal.Body>
      </Modal>
  );
};

export default LoginModal;
