import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { logout } from '../../store/session';
import styles from './NavBar.module.css';

const NavBar = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  let profileSrc;
  if (user) {
    profileSrc = user.profile_img_url ? user.profile_img_url : '/images/blank-profile-img.webp';
  }
  const [profileMenu, showProfileMenu] = useState(false);

  const onLogout = async () => {
    await dispatch(logout());
    history.push('/');
  }

  const toProfile = () => {
    showProfileMenu(false);
    history.push(`/profiles/${user.username}`);
  }

  return (
    <nav>
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
              >
                Main Page
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
                  <i class="far fa-file-upload"></i>
                </NavLink>
                <img
                  className={styles.profile__icon}
                  src={profileSrc}
                  onClick={() => showProfileMenu(!profileMenu)}
                />
                {profileMenu &&
                  <div className={styles.profile__dropdown}>
                      <li onClick={toProfile}>My Profile</li>
                      <li onClick={onLogout}>Logout</li>
                  </div>
                }
              </div>
            </li>
          </ul>
        }
        {(!user && location.pathname === '/') &&
          <ul className={styles.login_signup__container}>
            <li>
              <NavLink to="/login" exact={true} className={styles.login__link} activeClassName="active">
                Login
              </NavLink>
            </li>
            <li> or </li>
            <li>
              <NavLink to="/sign-up" exact={true} className={styles.signup__link} activeClassName="active">
                Sign Up
              </NavLink>
            </li>
          </ul>
        }
    </nav>
  );
}

export default NavBar;
