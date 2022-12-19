import React, {useState, useEffect, useContext} from 'react';
import '../App.css';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import {AuthContext} from '../firebase/Auth';
import 'bootstrap/dist/css/bootstrap.css';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';

function Event () {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [eventData, setEventData] = useState(undefined);
    const [attending, setAttending] = useState(false);
    const {currentUser} = useContext(AuthContext);
    let {scheduleId, eventId} = useParams();

    useEffect(() => {
      console.log('on load useEffect');
      async function fetchData() {
        try {
          setLoading(true);
          const { data } = await axios.get('http://localhost:3001/schedules/' + scheduleId + '/' + eventId);
          setEventData(data);
          setAttending(data.attendees.includes(currentUser.email));
          setLoading(false);
        } catch (e) {
            setError(true);
            setLoading(false);
            console.log(e);
        }
      };
      fetchData();
    }, [scheduleId, eventId, attending, currentUser.email]);


    const buildAttendees = (attendees) => {
        let attendeeList = [];
        let item;
        for (let attendee of attendees){
            attendeeList.push(<ListGroup.Item>{attendee}</ListGroup.Item>);
        }

        return attendeeList
    };

    const join = async (event) => {
        event.attendees.push(currentUser.email)
        let body =  {userId: currentUser.email, attendees: event.attendees};
        let newEvent = await axios({
            method: 'patch',
            url: '/schedules/' + scheduleId + '/' + eventId,
            baseURL: 'http://localhost:3001',
            headers: {'Content-Type' : 'application/json'},
            data: body
        })
        setAttending(true);
    }

    const leave = async (event) => {
        let attendeeIndex = event.attendees.findIndex(attendee => attendee == currentUser.email);
        event.attendees.splice(attendeeIndex, 1);
        let body =  {userId: currentUser.email, attendees: event.attendees};
        let newEvent = await axios({
            method: 'patch',
            url: '/schedules/' + scheduleId + '/' + eventId,
            baseURL: 'http://localhost:3001',
            headers: {'Content-Type' : 'application/json'},
            data: body
        })
        setAttending(false);
    }

    if(loading) {
        return (<p>Loading...</p>);
    }else if(error){
        return (<p>404 Page not found.</p>);
    }else {
        return (
            <Card>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>{eventData.name}</Card.Title>
                    <Card.Text>Description: {eventData.description}</Card.Text>
                    <Card.Text>Cost: ${eventData.cost}</Card.Text>
                    <Card.Text>Start Time: {new Date(eventData.startTime).toLocaleString()}</Card.Text>
                    <Card.Text>End Time: {new Date(eventData.endTime).toLocaleString()}</Card.Text>
                    <ListGroup>Attendees:
                        {() => buildAttendees(eventData.attendees)}
                    </ListGroup>
                    <br/>
                    {!attending && <Button onClick={() => join(eventData)}>Join Event</Button>}
                    {attending && <Button onClick={() => leave(eventData)}>Leave Event</Button>}
                </Card.Body>
            </Card>
        );
    }
}

export default Event;