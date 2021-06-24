import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { signUp, login } from '../../../store/session';
import { Form, Button } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AvatarInput from './AvatarInput';
import styles from './SignUpForm.module.css';
import postcardStamp from '../../../images/postcard-stamp.png';

const SignUpForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user);
  const [picture, setPicture] = useState(null);
  const [choosingPicture, setChoosingPicture] = useState(false);
  const [error, setError] = useState([]);

  const onSignUp = async values => {
    if (values.password === values.confirmPassword) {
      const data = await dispatch(
        signUp(values.username, values.email, values.password, picture));
      if (data.errors) {
        console.log(data.errors);
        setError('.......');
        setTimeout(() => {
          setError('');
        }, 5000);
      }
    }
  };

  const signInAsDemo = async () => {
    const data = await dispatch(login('demo@aa.io', 'password'))
    if (data.errors) {
      setError(data.errors);
    }
  }

  if (user) {
    return <Redirect to="/photos" />;
  }

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  }

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required.'),
    email: Yup.string().email().required('Email is required.'),
    password: Yup.string().required('Password is required.'),
    confirmPassword: Yup.string().required('Confirm Password is required.')
        .oneOf([Yup.ref('password'), null], 'Passwords must match.')
  });

  return (
    <div>
      <div className={styles.postcard__title}>
        <img className={styles.postcard__logo} src={postcardStamp} />
        <h1>Postacard</h1>
      </div>
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
                <h1 className={styles.signup__title}>Sign up</h1>
                <div className={styles.error__signin}>{error}</div>
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
                    <Button className={styles.photo__select} onClick={() => setChoosingPicture(true)}>Choose a Photo</Button>
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
                  <Form.Label>Confirm Password</Form.Label>
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
                <Button
                  className={!(dirty && isValid) ?
                              `${styles.button__disable} ${styles.submit__btn}` : styles.submit__btn}
                  disabled={!(dirty && isValid)}
                  variant="primary"
                  type="submit">
                    Create Account</Button>
                <div className={styles.other__options}>
                  <div>Have an account?
                    <a tabIndex='0' className={styles.redirect} onClick={() => history.push('/login')}> Sign In </a>
                  </div>
                  <div>Or login as a <a tabIndex='0' className={styles.redirect} onClick={() => signInAsDemo()}>DemoUser</a></div>
                </div>
              </Form>
            )}
        </Formik>
        <AvatarInput
          setPicture={setPicture}
          setChoosingPicture={setChoosingPicture}
          choosingPicture={choosingPicture} />
      </div>
    </div>
  );
};

export default SignUpForm;
