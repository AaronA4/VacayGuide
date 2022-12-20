import axios from 'axios';
import React, {useState, useContext, useEffect} from 'react';
import {AuthContext} from '../firebase/Auth';

function AddSchedule() {
    const currentUser = useContext(AuthContext);
    const [formData, setFormData] = useState({name: '', creator: currentUser.email, attendees: [], events: []});

    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    async function createSchedule() {
        let body = {
            userId: currentUser.email,
            name: formData.name,
            creator: formData.creator,
            attendees: formData.attendees,
            events: formData.events
        }
        try {
            let newSchedule = await axios({
                method: 'post',
                url: '/schedules',
                baseURL: 'http://localhost:3001',
                headers: {'Content-Type': 'application/json'},
                data: body
            })
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <form onSubmit={handleChange}>
                <div className='form-group'>
                    <label>
                        Schedule Name:
                        <input
                            // onChange={(e) => handleChange(e)}
                            className='form-control'
                            required
                            name='name'
                            type='text'
                            placeholder='Name'
                        />
                    </label>
                </div>
                <button onClick={createSchedule}>
                    Submit
                </button>
            </form>
        </div>
    )
}

export default AddSchedule;