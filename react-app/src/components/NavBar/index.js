import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory, Redirect } from 'react-router-dom';
import { logout } from '../../store/session';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import styles from './NavBar.module.css';
import blankProfile from '../MainPage/PhotoCard/blank-profile-img.png';
import postcardStamp from '../../images/postcard-stamp.png';

const NavBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  let profileSrc;
  if (user) {
    profileSrc = user.profile_img_url ? user.profile_img_url : blankProfile;
  }
  const [profileMenu, showProfileMenu] = useState(false);

  const onLogout = async () => {
    showProfileMenu(false);
    await dispatch(logout());
    history.push('/');
  }

  const toProfile = () => {
    showProfileMenu(false);
    history.push(`/profiles/${user.username}`);
  }

  const redirect = () => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push('/');
    }
  }

  const uploadTooltip = props => (
    <Tooltip id="upload-tooltip" {...props}>Upload an image</Tooltip>
  );



  useEffect(() => {
    const eventFunc = e => {
      let profDrpdwn = document.getElementById('profDrpDwn');
      if (profileMenu && profDrpdwn && !profDrpdwn.contains(e.target)) {
        showProfileMenu(false);
      }
    };
    document.addEventListener('click', eventFunc);
    return () => document.removeEventListener('click', eventFunc);
  }, [profileMenu]);

  return (
    <>
      <nav className={styles.navbar}>
          {user &&
            <ul className={styles.navbar__container}>
              <li className={styles.navbar__welcome}>
                <h1>Welcome, {user && user.username}</h1>
              </li>
              <li className={styles.navbar__main}>
                <NavLink
                  to="/photos"
                  exact={true}
                  activeClassName="active"
                  className={styles.navbar__name}
                >
                  <img className={styles.logo} src={postcardStamp} />
                  <span>Postacard</span>
                </NavLink>
              </li>
              <li className={styles.navbar__right}>
                <div>
                  <NavLink
                    to='/photo-upload'
                    exact={true}
                    activeClassName="active"
                    className={styles.upload__icon}
                  >
                    <OverlayTrigger
                      placement="left"
                      delay={{ show: 250, hide: 250 }}
                      overlay={uploadTooltip}
                    >
                      <i class="far fa-file-upload"></i>
                    </OverlayTrigger>
                  </NavLink>
                  <img
                    className={styles.profile__icon}
                    src={profileSrc}
                    onClick={() => showProfileMenu(!profileMenu)}
                  />
                  {profileMenu &&
                    <div id='profDrpDwn' className={styles.profile__dropdown}>
                        <li onClick={toProfile}>My Profile</li>
                        <li onClick={onLogout}>Logout</li>
                    </div>
                  }
                </div>
              </li>
            </ul>
          }
      </nav>
      {!user && redirect}
    </>
  );
}

export default NavBar;
