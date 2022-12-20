import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

function SearchUsers() {
    const [loading, setLoading] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(null);

    useEffect(() => {
        console.log('User Search useEffect')
        async function fetchData() {
          try {
            if(searchTerm !== null){
                console.log(searchTerm);
                const {data} = await axios.get(`http://localhost:3001/users/${searchTerm}`);
                setUsersData(data);
                setLoading(false);
            } else {
                setUsersData([]);
                setLoading(false);
            }
          } catch (e) {
            console.log(e);
          }
        }
        fetchData();
      }, [searchTerm]);

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(document.getElementById('searchTerm').value);
    }

    if (loading) {
        return (
            <div className="content">
                <form onSubmit={handleSearch}>
                    <div className='form-group'>
                        <label>
                            Search Term:
                            <input
                                className='form-control'
                                name='searchTerm'
                                id='searchTerm'
                                type='text'
                                placeholder='Search Term'
                                required
                            />
                        </label>
                    </div>
                    <button type='submit'>Search</button>
                </form>
                <div>
                    <h2>Loading. . . .</h2>
                </div>
            </div>
        );
    } else {
        console.log(usersData);
        return (
            <div className="content">
                <form onSubmit={handleSearch}>
                    <div className='form-group'>
                        <label>
                            Search Term:
                            <input
                                className='form-control'
                                name='searchTerm'
                                id='searchTerm'
                                type='text'
                                placeholder='Search Term'
                                required
                            />
                        </label>
                    </div>
                    <button type='submit'>Search</button>
                </form>
            </div>
        );
    }
}

export default SearchUsers;
