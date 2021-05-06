import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';
import styles from './NavBar.module.css';

const NavBar = () => {
  const user = useSelector(state => state.session.user);

  return (
    <nav>
        {user &&
          <ul className={styles.navbar__container}>
            <li>
              <NavLink to="/photos" exact={true} activeClassName="active">
                Main Page
              </NavLink>
            </li>
            <li>
              <LogoutButton />
            </li>
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
