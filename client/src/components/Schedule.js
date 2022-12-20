import React, {useState, useEffect, useContext} from 'react';
import {Link, useParams} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import {AuthContext} from '../firebase/Auth';
import '../App.css';

function Schedule(props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scheduleData, setScheduleData] = useState(undefined);
  const [eventData, setEventData] = useState(undefined);
  const [addBtnToggle, setAddBtnToggle] = useState(false);
  const {currentUser} = useContext(AuthContext);
  let {scheduleId} = useParams();
  let list = null;

  useEffect(() => {
    console.log('Schedule useEffect')
    async function fetchData() {
      try {
        setLoading(true);
        const {data: schedule} = await axios.get(`http://localhost:3001/schedules/${scheduleId}`)
        setScheduleData(schedule);
        setEventData(schedule.events);
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
        console.log(e);
      }
    }
    fetchData();
  }, [scheduleId]);


  const isEmpty = (lst) => {
    if (lst.length === 0) return true;
    else return false;
  }

  list = 
    eventData
    && eventData.map((event) => {
      return (
        <Link to={`/schedules/${scheduleId}/${event.id}`}>
          <Card id = {event.id}>
            <Card.Body>
              <Card.Title>{event.name}</Card.Title>
              <Card.Text>{event.description}</Card.Text>
              <Card.Text>Cost: {event.cost}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
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
        <h2>This is where the details of a singular Schedule are displayed.</h2>
        <h2>{scheduleData.name}</h2>
        <div className="container">
          <h3 className="container-title">Events</h3>
          <Button onClick={() => setAddBtnToggle(!addBtnToggle)}>Add Event</Button>
          <div class="row justify-content-center">
            {list}
          </div>
        </div>
      </div>
    );
  }
}
  
export default Schedule;
  