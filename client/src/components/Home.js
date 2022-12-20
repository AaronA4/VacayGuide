import React, { useContext, useState } from 'react';
import '../App.css';
import { AuthContext } from '../firebase/Auth';
import Account from './Account';
import MyInvites from './MyInvites';
import Card from 'react-bootstrap/Card';

function Home() {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      <h2>Welcome {currentUser.displayName}</h2>
      <div className="container">
        <div className="row">
          <Card id="Account">
            <Card.Body>
              <Account />
            </Card.Body>
          </Card>
          <Card id="Invites">
            <Card.Body>
              <MyInvites />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
