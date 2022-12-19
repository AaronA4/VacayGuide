import React from 'react';
import '../App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Account from './Account';
import Home from './Home';
import Landing from './Landing';
import Schedules from './Schedules';
import Navigation from './Navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Calendar from './Calendar';
import Event from './Event';
import CreateEvent from './CreateEvent';
import {AuthProvider} from '../firebase/Auth';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <header className='App-header'>
            <Navigation />
          </header>
        </div>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/home' element={<PrivateRoute />}>
            <Route path='/home' element={<Home />} />
          </Route>
          <Route path='/account' element={<PrivateRoute />}>
            <Route path='/account' element={<Account />} />
          </Route>
          <Route path='/schedules' element={<PrivateRoute />}>
            <Route path='schedules' element={<Schedules />} />
            <Route path='/schedules/:scheduleId/calendar' element={<Calendar />} />
            <Route path='/schedules/:scheduleId/:eventId' element={<Event />} />
            <Route path='/schedules/:scheduleId/calendar/createEvent' element={<CreateEvent />} />
          </Route>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
