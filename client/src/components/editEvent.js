import React, {useState, useEffect} from 'react';
import '../App.css';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';

function EditEvent() {
    const [loading, setLoading] = useState(true);
    const [scheduleData, setScheduleData] = useState(undefined);
    let {scheduleId, eventId} = useParams();

    useEffect(() => {
      console.log('on load useEffect');
      async function fetchData() {
        try {
          setLoading(true);
          const { schedule } = await axios.get('http://localhost:3000/schedules/' + scheduleId);
          setSchedulesData(data);
          setLoading(false);
        } catch (e) {
          console.log(e);
        }
      };
      fetchData();
    }, [scheduleId]);
}

export default EditEvent;