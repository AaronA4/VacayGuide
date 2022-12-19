import axios from 'axios';
import React, {useState, useContext} from 'react';
import {AuthContext} from '../firebase/Auth';

function AddSchedule() {
    const currentUser = useContext(AuthContext);
    const [formData, setFormData] = useState({name: '', creator: currentUser.email, attendees: [], events: []});

    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    async function createSchedule() {
        try {
            const {data} = await axios.post('http://localhost:3000/schedules', {
                method:'POST',
                mode: 'cors',
                body: formData
            });
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
                            onChange={(e) => handleChange(e)}
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