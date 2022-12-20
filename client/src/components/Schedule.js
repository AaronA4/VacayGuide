import React, {useState, useEffect, useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import firebase from 'firebase/app';
import { getSessionToken } from '../firebase/FirebaseFunctions';
import {AuthContext} from '../firebase/Auth';
import CreateEvent from './CreateEvent'
import InviteForm from './Forms/InviteForm'
import '../App.css';

function Schedule(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scheduleData, setScheduleData] = useState(undefined);
  const [eventData, setEventData] = useState(undefined);
  const [addBtnToggle, setAddBtnToggle] = useState(false);
  const [invBtnToggle, setInvBtnToggle] = useState(false);
  const {currentUser} = useContext(AuthContext);
  let params = useParams();
  let list = null;

  const email = firebase.auth().currentUser.email;
  const accessToken = getSessionToken();
  const headers = {headers: {
    email : email,
    accesstoken: accessToken
  }};

  useEffect(() => {
    console.log('Schedule useEffect')
    async function fetchData() {
      try {
        setLoading(true);
        const {data: schedule} = await axios.get(
          `http://localhost:3001/schedules/${params.scheduleId}`,
          headers
        )
        setScheduleData(schedule);
        setEventData(schedule.events);
        console.log(schedule.events);
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
        console.log(e);
      }
    }
    fetchData();
  }, [params.scheduleId]);


  const isEmpty = (lst) => {
    if (lst.length === 0) return true;
    else return false;
  }

  list = 
    eventData
    && eventData.map((event,index) => {
      return (
        <Card key = {index}>
          <Card.Body>
            <Card.Title>{event.name}</Card.Title>
            <Card.Text>{event.description}</Card.Text>
            <Card.Text>Cost: {event.cost}</Card.Text>
            <Link to={`/schedules/${params.scheduleId}/event/${event.name}`}>
              More Info
            </Link>
          </Card.Body>
        </Card>
      )
    })
    
  if (loading) {
    return (
      <div>
        <h2>Loading. . . .</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>404 Page Not Found.</h2>
      </div>
    );
  } else {
    return (
      <div className="content">
        <br />
        <h2>{scheduleData.name}</h2>
        <Button onClick={() => setInvBtnToggle(!invBtnToggle)}>Invite User</Button>
        {invBtnToggle && <InviteForm />}
        <div className="container">
          <h3 className="container-title">Events</h3>
          <Button onClick={() => setAddBtnToggle(!addBtnToggle)}>Add Event</Button>
          {addBtnToggle && <CreateEvent />}
          <br />
          <br />
          <div className="row justify-content-center">
            {list}
          </div>
        </div>
      </div>
    );
  }
}
  
export default Schedule;
  