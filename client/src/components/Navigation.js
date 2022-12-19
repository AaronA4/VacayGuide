import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';
import SignOutButton from './SignOut';
//import '/bootstrap/dist/css/bootstrap.css';

const Navigation = () => {
  const {currentUser} = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">Vacay Guide</a>
      <button 
        className="navbar-toggler" 
        type="button" 
        data-toggle="collapse"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle Navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item-active">
            <NavLink className="nav-link" to='/'>Landing </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to='/home'>Home </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to='/account'>Account </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to='/schedules'>Schedules </NavLink>
          </li>
          <li>
            <SignOutButton />
          </li>
        </ul>
      </div>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className='navigation'>
      <ul>
        <li>
          <NavLink to='/'>Landing</NavLink>
        </li>
        <li>
          <NavLink to='/signup'>Sign-up</NavLink>
        </li>
        <li>
          <NavLink to='/signin'>Sign-In</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
