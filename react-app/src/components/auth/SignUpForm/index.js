import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signUp } from '../../../store/session';
import AvatarInput from './AvatarInput';
import styles from './SignUpForm.module.css';

const SignUpForm = () => {
  const dispatch = useDispatch();
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
    <div>
      {!choosingPicture &&
        <form onSubmit={onSignUp}>
          <div>
            <label>User Name</label>
            <input
              type="text"
              name="username"
              onChange={updateUsername}
              value={username}
            ></input>
          </div>
          <div>
            <label>Email</label>
            <input
              type="text"
              name="email"
              onChange={updateEmail}
              value={email}
            ></input>
          </div>
          <div>
            <label>Profile Picture (Optional)</label>
            {!picture &&
              <button onClick={() => setChoosingPicture(true)}>Choose a Photo</button>
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
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={updatePassword}
              value={password}
            ></input>
          </div>
          <div>
            <label>Repeat Password</label>
            <input
              type="password"
              name="repeat_password"
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
            ></input>
          </div>
          <button type="submit">Sign Up</button>
        </form>
      }
      {choosingPicture &&
        <div>
          <label>Profile Picture (Optional)</label>
          <AvatarInput setPicture={setPicture} setChoosingPicture={setChoosingPicture} />
        </div>
      }
    </div>
  );
};

export default SignUpForm;
