import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { signUp, login } from '../../../store/session';
import { Form, Button } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AvatarInput from './AvatarInput';
import styles from './SignUpForm.module.css';

const SignUpForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState(null);
  const [repeatPassword, setRepeatPassword] = useState("");
  const [choosingPicture, setChoosingPicture] = useState(false);
  const [errors, setErrors] = useState([]);

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password, picture));
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  const signInAsDemo = async () => {
    const data = await dispatch(login('demo@aa.io', 'password'))
    if (data.errors) {
      setErrors(data.errors);
    }
  }

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/photos" />;
  }

  const initialValues = {
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    profileImage: null
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required.'),
    email: Yup.string().email().required('Email is required.'),
    password: Yup.string().required('Password is required.'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match.')
  });

  return (
    <div className={styles.signup_form__container}>
      <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSignUp}
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
              <h1>Sign up</h1>
              <div className={styles.error__signin}>{}</div>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  required
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.username && !errors.username}
                />
                <ErrorMessage name="username" component="span" className={styles.error__input} />
              </Form.Group>
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
              {!picture &&
                <div className={styles.picture_input__container}>
                  <label>Profile Picture (Optional)</label>
                  <Button onClick={() => setChoosingPicture(true)}>Choose a Photo</Button>
                </div>
              }
              {picture &&
                <div className={styles.picture__container}>
                  <img
                    src={URL.createObjectURL(picture)}
                    className={styles.cropped__profile}
                  />
                  <Button onClick={() => setPicture()}>Delete Photo</Button>
                </div>
              }
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
              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.confirmPassword && !errors.confirmPassword}
                />
                <ErrorMessage name="confirmPassword" component="span" className={styles.error__input} />
              </Form.Group>
              <Button type="submit">Create Account</Button>
              <div className={styles.other__options}>
                <div>Have an account?
                  <span className={styles.redirect} onClick={() => history.push('/login')}> Sign In </span>
                </div>
                <div>or login as a <span className={styles.redirect} onClick={() => signInAsDemo()}>DemoUser</span></div>
              </div>
            </Form>
          )}
      </Formik>
      <AvatarInput
        setPicture={setPicture}
        setChoosingPicture={setChoosingPicture}
        choosingPicture={choosingPicture} />
    </div>
  );
};

export default SignUpForm;
