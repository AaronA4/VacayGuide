import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';
import SignOutButton from './SignOut';
import '../App.css';

const Navigation = () => {
  const {currentUser} = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (

      <nav class="navbar navbar-expand-lg navbar-light bg-light">
       <a class="navbar-brand" href="#">Vacay Guide</a>
       <button 
         class="navbar-toggler" 
         type="button" 
         data-toggle="collapse"
         aria-controls="navbarSupportedContent"
         aria-expanded="false"
         aria-label="Toggle Navigation"
       >
         <span class="navbar-toggler-icon"></span>
       </button>
       <div class="collapse navbar-collapse" id="navbarSupportedContent">
         <ul class="navbar-nav mr-auto">
           <li class="nav-item-active">
             <NavLink class="nav-link" to='/'>Landing</NavLink>
           </li>
           <li class="nav-item">
             <NavLink class="nav-link" to='/home'>Home</NavLink>
           </li>
           <li class="nav-item">
             <NavLink class="nav-link" to='/account'>Account</NavLink>
           </li>
           <li class="nav-item">
             <NavLink class="nav-link" to='/schedules'>Schedules</NavLink>
           </li>
           <li class="nav-item">
            <NavLink to='/myInvites'>My Invites</NavLink>
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
