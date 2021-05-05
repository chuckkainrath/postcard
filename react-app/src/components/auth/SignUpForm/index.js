import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signUp } from '../../../store/session';
import styles from './SignUpForm.module.css';
import { fabric } from 'fabric';


const SignUpForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');
  const [repeatPassword, setRepeatPassword] = useState("");
  let circle;

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

  const updatePicture = (e) => {
    const picUrl = URL.createObjectURL(e.target.files[0]);
    setPictureUrl(picUrl)
    const canvasEl = document.getElementById('profile_canvas');
    canvasEl.classList.replace(styles.hide_canvas, styles.show_canvas);
    const canvas = new fabric.Canvas('profile_canvas');
    fabric.Image.fromURL(picUrl, (img) => {
      img.scale(0.25);
      canvas.setHeight(img.height / 4);
      canvas.setWidth(img.width / 4);
      canvas.setBackgroundImage(img);
    })
    circle = new fabric.Circle({
      radius: 50, left: 50, top: 50,
      stroke: 'rgba(255,255,255,0.8)',
      strokeDashArray: [5, 5],
      fill: 'rgba(0,0,0,0)'
    })
    circle.controls = {
      ...fabric.Circle.prototype.controls,
      mtr: new fabric.Control({ visible: false }),
      ml: new fabric.Control({ visible: false }),
      mr: new fabric.Control({ visible: false }),
      mt: new fabric.Control({ visible: false }),
      mb: new fabric.Control({ visible: false })
    }
    canvas.add(circle);
    setPicture(e.target.files[0]);
  }

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  const cropImage = () => {
    console.log(circle);
  }

  if (user) {
    return <Redirect to="/photos" />;
  }

  return (
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
        <label>Profile Picture</label>
        <input
          type="file"
          name="profile_picture"
          onChange={updatePicture}
          accept=".png, .jpg, .jpeg"
        />
      </div>
      {/* {pictureUrl && <img className={styles.profile_preview} src={pictureUrl}></img>} */}
      <canvas className={styles.hide_canvas} id='profile_canvas'></canvas>
      <button onClick={cropImage}>Crop Image</button>
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
  );
};

export default SignUpForm;
