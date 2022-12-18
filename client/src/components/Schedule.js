import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function Schedule(props) {
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState(undefined);
  const [showBtnToggle, setBtnToggle] = useState(false);
  let {id} = useParams();
  let list = null;

  useEffect(() => {
    console.log('Schedule useEffect')
    async function fetchData() {
      try {
        const {data: schedule} = await axios.get(`http://localhost:3000/${id}`);
        setScheduleData(schedule);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [id]);

  list = 
    scheduleData
    && scheduleData.events.map((event, index) => {
      return (
      <div class="card col-lg-3 col-md-6 col-sm-12">
        <div class="card-body">
          <h4 class="card-title">{event.name}</h4>
          <h5 class="card-subtitle">{event.cost}</h5>
          <p class="card-text">{event.desc}</p>
          <button onClick={()=> setBtnToggle(!showBtnToggle)}>Show Attendees</button>
          {showBtnToggle && <Attendees />}
        </div>
      </div>
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
      <div class="content">
        <br />
        <h2>This is where the details of a singular Schedule are displayed.</h2>
        <h2>{scheduleData.name}</h2>
        <div class="container">
          <h3 class="container-title">Events</h3>
          <div class="row justify-content-center">
            {list}
          </div>
        </div>
      </div>
    );
  }
}
  
export default Schedule;
  