import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { logout } from '../../store/session';
import styles from './NavBar.module.css';

const NavBar = () => {
  const history = useHistory();
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

  return (
    <nav>
        {user &&
          <ul className={styles.navbar__container}>
            <li>
              <NavLink
                to="/photos"
                exact={true}
                activeClassName="active"
                className={styles.navbar__main}
              >
                Main Page
              </NavLink>
            </li>
            <li>
                <img
                  className={styles.profile__icon}
                  src={profileSrc}
                  onClick={() => showProfileMenu(!profileMenu)}
                />
            </li>
            <li>
              <NavLink
                to='/photo-upload'
                exact={true}
                activeClassName="active"
                className={styles.upload__icon}
              >
                <i class="far fa-file-upload"></i>
              </NavLink>
            </li>
            {profileMenu &&
              <div className={styles.profile__dropdown}>
                  <li onClick={() => history.push(`/profiles/${user.username}`)}>My Profile</li>
                  <li onClick={onLogout}>Logout</li>
              </div>
            }
          </ul>
        }
        {!user &&
          <ul className={styles.navbar__container}>
            <li>
              <NavLink to="/login" exact={true} activeClassName="active">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/sign-up" exact={true} activeClassName="active">
                Sign Up
              </NavLink>
            </li>
          </ul>
        }
    </nav>
  );
}

export default NavBar;
