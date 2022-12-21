import React, { useEffect, useState, useContext } from 'react';
import firebase from 'firebase/app';
import '../App.css';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import {AuthContext} from '../firebase/Auth';
import { getSessionToken } from '../firebase/FirebaseFunctions';

let invite = null;

function MyInvites() {
    const myUserId = '';
    const [loading, setLoading] = useState(true);
    const [invites, setInvites] = useState(null);
    //const currentUser = useContext(AuthContext);
    const myInvitesUrl = `http://localhost:3001/invites`;

    
    const email = firebase.auth().currentUser.email;
    const accessToken = getSessionToken();
    const headers = {headers: {
      email : email,
      accesstoken: accessToken,
      'Access-Control-Allow-Origin':'*'
    }};


    async function pullInvites() {
      try {
        const {data: invites} = await axios.get(myInvitesUrl, headers); 
        console.log(invites);
        setInvites(invites);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }

    useEffect(() => {
        console.log('Pull My Invites');
        pullInvites();
      }, []);

      const acceptInvitation = async(id) => {
        const response = await axios.put(myInvitesUrl+`/${id}/approve`, {}, headers);
        setLoading(true);
        pullInvites();
      }

      const denyInvitation = async(id) => {
        const response = await axios.put(myInvitesUrl+`/${id}/deny`, {}, headers);
        setLoading(true);
        pullInvites();
      }

      const buildCard = (invite) => {
        return(
          <Card id = {invite.id} key={invite.id}>
            <Card.Body>
              <Card.Title>{invite.name}</Card.Title>
              <Card.Text>{`${invite.creator.firstName} ${invite.creator.lastName}`}</Card.Text>
              <Card.Text>Events: {invite.events}</Card.Text>
            </Card.Body>
            <button onClick={() => acceptInvitation(invite.id)}>Accept</button> 
            <button onClick={() => denyInvitation(invite.id)}>Deny</button>
          </Card>
        )
      }

      const inviteCards = invites && invites.map((inviteItem) => {
        return buildCard(inviteItem);
      }) 

      if(invites) {
        return (
          // Show Invites List with detailed attributes 
          <div>
            <h1>Current Invites</h1>
            {inviteCards}
          </div>
        );
      } else if(loading){
        return (
          <div>
            <h2>Loading....</h2>
          </div>
        )
      } else {
        return (<div></div>);
      }
}

export default MyInvites;