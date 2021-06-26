import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory, Redirect } from 'react-router-dom';
import { logout } from '../../store/session';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { search } from '../../util/search';
import PhotoUpload from '../PhotoUpload/UploadPage';
import styles from './NavBar.module.css';
import blankProfile from '../MainPage/PhotoCard/blank-profile-img.png';
import postcardStamp from '../../images/postcard-stamp.png';

const NavBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const [uploadPhoto, showUploadPhoto] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState({});
  const [noResults, setNoResults] = useState(true);

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

  const uploadTooltip = props => (
    <Tooltip id="upload-tooltip" {...props}>Upload an image</Tooltip>
  );

  useEffect(() => {
    const eventFunc = e => {
      if (user) {
        let profImg = document.getElementById('profileImg');
        let profDrpdwn = document.getElementById('profDrpDwn');
        if (profileMenu && profDrpdwn && !profDrpdwn.contains(e.target)) {
          showProfileMenu(false);
        } else if (profImg.contains(e.target)) {
          showProfileMenu(!profileMenu);
        }
      }
    };
    document.addEventListener('click', eventFunc);
    return () => document.removeEventListener('click', eventFunc);
  }, [profileMenu, user]);

  if (!user) {
    return null;
  }

  const searchInputChange = async e => {
    let val = e.target.value;
    if (val) {
      const res = await search(`/api/users/${val}/search`);
      if (Object.keys(res).length) {
        setSearchResults(res);
        setNoResults(false);
      } else {
        setSearchResults({});
        setNoResults(true);
      }
    } else {
      setSearchResults({});
      setNoResults(true);
    }
    setSearchInput(val);
  }

  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navbar__container}>
          <li className={styles.navbar__welcome}>
            <h1>Welcome, {user && user.username}</h1>
            <input
              type='search'
              value={searchInput}
              onChange={searchInputChange}
            />
            <div>
              {(searchInput && noResults) && <h1>No results found.</h1>}
              {searchResults &&
                Object.values(searchResults).map(result => (
                  <li><span>{result.username}</span></li>
                ))
              }
            </div>
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
              <div
                className={styles.upload__icon}
                onClick={() => showUploadPhoto(!uploadPhoto)}
              >
                <OverlayTrigger
                  placement="left"
                  delay={{ show: 250, hide: 250 }}
                  overlay={uploadTooltip}
                >
                  <i class="far fa-file-upload"></i>
                </OverlayTrigger>
              </div>
              <img
                id='profileImg'
                className={styles.profile__icon}
                src={profileSrc}
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
      </nav>
      <PhotoUpload
        uploadImage={uploadPhoto}
        showUploadImage={showUploadPhoto}
      />
    </>
  );
}

export default NavBar;
