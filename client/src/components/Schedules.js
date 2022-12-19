import React, {useState, useEffect} from 'react';
import '../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
import AddSchedule from './AddSchedule';

function Schedules() {
  const [loading, setLoading] = useState(true);
  const [schedulesData, setSchedulesData] = useState(undefined);
  const [addBtnToggle, setBtnToggle] = useState(false);
  let list = null;

  useEffect(() => {
    console.log('on load useEffect');
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:3001/schedules/');
        setSchedulesData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);
  
  const buildCard = (schedule) => {
    return (
      <Link to={`/schedules/${schedule._id}`}>
        <Card id={schedule._id}>
          <Card.Body>
            <Card.Title>{schedule.name}</Card.Title>
            <Card.Text>More Info</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    )
  }

  list = 
    schedulesData 
    && schedulesData.map((schedule) => {
      return buildCard(schedule);
    });

  if (loading) {
    return (
      <div>
        <h2>Loading. . . .</h2>
      </div>
    );
  } else {
    return (
      <div class="content">
        <br />
        <h1>Current Vacay Schedules</h1>
        <br />
        <Button onClick={()=> setBtnToggle(!addBtnToggle)}>Create Schedule</Button>
        <br />
        <AddSchedule />
        <br />
        <div class="container">
          <div class="row">
            {list}
          </div>
        </div>
      </div>
    );
  }
}
  
export default Schedules;
  