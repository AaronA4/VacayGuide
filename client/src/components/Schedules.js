import React, {useState, useEffect} from 'react';
import '../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';

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
      <Link to={`/schedules/${schedule.id}`}>
        <div id={schedule.id} class="card col-lg-3 col-md-6 col-sm-12">
          {/* <img class="card-img-top" src="IMG SOURCE HERE" alt="scheduleImg"/> */}
          <div class="card-body">
            <h2 class="card-title">{schedule.name}</h2>
            <span class="card-text">More Info</span>
          </div>
        </div>
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
        <button onClick={()=> setBtnToggle(!addBtnToggle)}>Create Schedule</button>
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
  