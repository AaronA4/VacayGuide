import React, {useState, useEffect, useContext} from 'react';
import '../App.css';
import {useParams, useNavigate} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import {AuthContext} from '../firebase/Auth';
import { checkString, checkCost, checkDate } from '../validation.js';

function EditEvent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [customError, setCustomError] = useState(undefined);
  const [scheduleData, setScheduleData] = useState(undefined);
  const [validated, setValidated] = useState(false);
  const {currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  let {scheduleId, eventId} = useParams();

  useEffect(() => {
    console.log('on load useEffect');
    async function fetchData() {
      try {
        setLoading(true);
        setError(false);
        const { data } = await axios.get('http://localhost:3001/schedules/' + scheduleId);
        setScheduleData(data);
        setLoading(false);
      } catch (e) {
        setError(true);
        setLoading(false);
        console.log(e);
      }
    };
    fetchData();
  }, [scheduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCustomError(undefined)
    const form = e.currentTarget;
    let flag = true;
    let name;
    let description;
    let cost;
    let startTime;
    let endTime;

    let eventData = scheduleData.events.find(event => event.name == eventId);

    try{
      if (form.name.value) {
        name = checkString(form.name.value, 'Name');
        for (let event of scheduleData.events) {
          if (event.name == name) throw 'Error: Cannot have two events with the same name';
        }
      }
      if (form.description.value) description = checkString(form.description.value, 'Description');
      if (form.cost.value) cost = checkCost(form.cost.value, 'Cost');
      if (form.startTime.value) {
        startTime = new Date(form.startTime.value);
        startTime = checkDate(startTime, 'Start Time');
      }
      if (form.endTime.value) {
        endTime = new Date(form.endTime.value);
        endTime = checkDate(endTime, 'End Time');
      }
      if (form.startTime.value && form.endTime.value && endTime.getTime() <= startTime.getTime()) throw 'Error: End time cannot happen before or at the same time as start time';
      if (form.startTime.value && !form.endTime.value && eventData.endTime <= startTime.getTime()) throw 'Error: End time cannot happen before or at the same time as start time';
      if (!form.startTime.value && form.endTime.value && endTime.getTime() <= eventData.startTime) throw 'Error: End time cannot happen before or at the same time as start time';
    }catch(e) {
      flag = false;
      setCustomError(e);
    }

    if (flag === true){
      let body = {
        userId: currentUser.email,
        name: name,
        description: description,
        cost: cost,
        startTime: startTime.getTime(),
        endTime: endTime.getTime()
      }; 

      try {
        let newEvent = await axios({
          method: 'post',
          url: '/schedules/' + scheduleId + '/createEvent',
          baseURL: 'http://localhost:3001',
          headers: {'Content-Type' : 'application/json'},
          data: body
        })
      }catch(e) {
        setCustomError(e);
      }

      navigate('/schedules/' + scheduleId + '/calendar');
    }

    setValidated(true);
  };

    if(loading) {
      return (<p>Loading...</p>)
    }else if(error) {
      return (<p>404 Page not found.</p>);
    }else {
      return (
        <div>
          <p>Edit Event</p>
          {customError && <p variant='warning'>{customError}</p>}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea" 
                rows={3} 
                placeholder="Enter description" 
              />   
             </Form.Group>

            <Form.Group className="mb-3" controlId="cost">
              <Form.Label>Cost</Form.Label>
              <Form.Control type="number" placeholder="Enter cost" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control type="datetime-local" placeholder="Enter start time" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="endTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control type="datetime-local" placeholder="Enter end time" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" placeholder="Image" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      )
    }
}

export default EditEvent;