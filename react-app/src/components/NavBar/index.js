import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory, Redirect } from 'react-router-dom';
import { logout } from '../../store/session';
import Modal from 'react-bootstrap/Modal';
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
                  <i class="far fa-file-upload"></i>
                </NavLink>
                <img
                  className={styles.profile__icon}
                  src={profileSrc}
                  onClick={() => showProfileMenu(!profileMenu)}
                />
                <Modal
                    show={profileMenu}
                    onHide={() => showProfileMenu(false)}
                    // dialogClassName={styles.modal__container}
                >
                  <div className={styles.profile__dropdown}>
                      <li onClick={toProfile}>My Profile</li>
                      <li onClick={onLogout}>Logout</li>
                  </div>
                </Modal>
              </div>
            </li>
          </ul>
        }
        {!user && <Redirect to='/'/>}
    </nav>
  );
}

export default NavBar;
