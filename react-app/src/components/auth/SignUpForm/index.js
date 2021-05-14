import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { signUp } from '../../../store/session';
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

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      await dispatch(signUp(username, email, password, picture));
    }
  };

  const signInAsDemo = async () => {
    //
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

  return (
    <div className={styles.signup_form__container}>
      {!choosingPicture &&
        <form className={styles.signup_form} onSubmit={onSignUp}>
          <h1>Sign Up</h1>
          <div className={styles.input__container}>
            <label>User Name</label>
            <input
              type="text"
              name="username"
              onChange={updateUsername}
              value={username}
            ></input>
          </div>
          <div className={styles.input__container}>
            <label>Email</label>
            <input
              type="text"
              name="email"
              onChange={updateEmail}
              value={email}
            ></input>
          </div>
          {!picture &&
            <div className={styles.picture_input__container}>
              <label>Profile Picture (Optional)</label>
              <button onClick={() => setChoosingPicture(true)}>Choose a Photo</button>
            </div>
          }
          {picture &&
            <div className={styles.picture__container}>
              <img
                src={URL.createObjectURL(picture)}
                className={styles.cropped__profile}
              />
              <button onClick={() => setPicture()}>Delete Photo</button>
            </div>
          }
          <div className={styles.input__container}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={updatePassword}
              value={password}
            ></input>
          </div>
          <div className={styles.input__container}>
            <label>Repeat Password</label>
            <input
              type="password"
              name="repeat_password"
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
            ></input>
          </div>
          <button className={styles.submit__btn} type="submit">Create Account</button>
          <div className={styles.other__options}>
            <div>Have an account?
              <span className={styles.redirect} onClick={() => history.push('/login')}> Sign In </span>
            </div>
            <div>or login as a <span className={styles.redirect} onClick={() => signInAsDemo()}>DemoUser</span></div>
          </div>
        </form>
      }
      {choosingPicture &&
        <div className={styles.picture__input}>
          <label>Profile Picture (Optional)</label>
          <AvatarInput setPicture={setPicture} setChoosingPicture={setChoosingPicture} />
        </div>
      }
    </div>
  );
};

export default SignUpForm;
