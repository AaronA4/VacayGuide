import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import '../App.css';

function Schedule(props) {
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState(undefined);
  const [listBtnToggle, setListBtnToggle] = useState(false);
  const [addBtnToggle, setAddBtnToggle] = useState(false);
  let {scheduleId} = useParams();
  let list = null;

  useEffect(() => {
    console.log('Schedule useEffect')
    async function fetchData() {
      try {
        const {data: schedule} = await axios.get(`http://localhost:3000/${scheduleId}`);
        setScheduleData(schedule);
        setLoading(false);
      } catch (e) {
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
    scheduleData
    && scheduleData.events.map((event) => {
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
  } else {
    return (
      <div className="content">
        <br />
        <h2>This is where the details of a singular Schedule are displayed.</h2>
        <h2>{scheduleData.name}</h2>
        <div className="container">
          <h3 className="container-title">Events</h3>
          <button onClick={() => setAddBtnToggle(!addBtnToggle)}>Add Event</button>
          <div class="row justify-content-center">
            {list}
          </div>
        </div>
      </div>
    );
  }
}
  
export default Schedule;
  