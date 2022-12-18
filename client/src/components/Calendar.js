import React, {useState, useEffect} from 'react';
import '../App.css';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'


function Calendar() {
    const [loading, setLoading] = useState(true);
    const [scheduleData, setScheduleData] = useState(undefined);
    const [myEvents, setEvents] = useState([]);
    let {scheduleId} = useParams();

    useEffect(() => {
      console.log('on load useEffect');
      async function fetchData() {
        try {
          setLoading(true);
          const { data } = await axios.get('http://localhost:5000/schedules/' + scheduleId);
          setScheduleData(data);
          console.log(scheduleData);
          const events = [];
          setEvents(events);
          setLoading(false);
        } catch (e) {
          console.log(e);
        }
      };
      fetchData();
    }, [scheduleId]);

    
    const onEventClick = React.useCallback((event) => {
        console.log(event)
    }, []);

    if(loading) {
      return (<p>Loading...</p>);
    }else {
      return (
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
          events={[]}
        />
      ); 
    }
}

export default Calendar;