import React, { useEffect, useState } from 'react';

import '../App.css';
import axios from 'axios';


function MyInvites() {
    const myUserId = '';
    const [loading, setLoading] = useState(true);
    const [invites, setInvites] = useState(null);
    const myInvitesUrl = `http://localhost:3001/invites`;

    useEffect(() => {
        console.log('Pull My Inivites');
        async function pullInvites() {
          try {
            // let config  = {headers: {'user-id': myUserId}};
            const {data: invites} = await axios.get(myInvitesUrl);
            console.log(invites);
            setInvites(invites);
            setLoading(false);
          } catch (e) {
            console.log(e);
          }
        }
        pullInvites();
      }, []);

  return (
    // Show Invites List with detailed attributes 
    <div>
      <h2>This is the Invitation page</h2>
    </div>
  );
}

export default MyInvites;