import React, {useState, useContext} from 'react';
import {AuthContext} from '../firebase/Auth';

function AddSchedule() {
    const currentUser = useContext(AuthContext);
    const [formData, setFormData] = useState({name: '', creator: 'currentUser'});

    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const createSchedule = () => {
        fetch('http://localhost:3000/users', {
            method:'POST',
            mode: 'cors',
            body: JSON.stringify(formData)
        });
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
                            name='scheduleName'
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