import React from 'react';
import '../App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Account from './Account';
import Home from './Home';
import Landing from './Landing';
import Schedules from './Schedules';
import Schedule from './Schedule';
import AddSchedule from './AddSchedule';
import Navigation from './Navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Calendar from './Calendar';
import Event from './Event';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import {AuthProvider} from '../firebase/Auth';
import PrivateRoute from './PrivateRoute';
import MyInvites from './MyInvites';
import SearchUsers from './SearchUsers';

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
            <Route path='/schedules' element={<Schedules />} />
            <Route path='/schedules/:id' element={<Schedule />} />
            <Route path='/schedules/createSchedule' element={<AddSchedule />} />
            <Route path='/schedules/:scheduleId/calendar' element={<Calendar />} />
            <Route path='/schedules/:scheduleId/:eventId' element={<Event />} />
            <Route path='/schedules/:scheduleId/calendar/createEvent' element={<CreateEvent />} />
            <Route path='/schedules/:scheduleId/calendar/editEvent/:eventId' element={<EditEvent />} />
          </Route>
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/users' element={<SearchUsers />} />
          <Route path='/myInvites' element={<PrivateRoute />}>
            <Route path='/myInvites' element={<MyInvites />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
