import React, {useContext, useState} from 'react';
import '../App.css';
import ChangePassword from './ChangePassword';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {AuthContext} from '../firebase/Auth';

function Account() {
  const {currentUser} = useContext(AuthContext);
  const [showChangePW, setShowChangePW] = useState(false);

  let User = () => {return (
        <Card id={currentUser.uid}>
          <Card.Body>
            <Card.Title>{currentUser.displayName}</Card.Title>
            <Card.Text>{currentUser.email}</Card.Text>
          </Card.Body>
        </Card>
    );
  }

  if(!showChangePW){
    return (
      <div class="container mr-auto">
        <h2>Account Page</h2>
        <User />
        <Button onClick={()=> setShowChangePW(!showChangePW)}>Change Password</Button>
      </div>
    );
  }else {
    return (
      <div class="container mr-auto">
        <h2>Account Page</h2>
        <User/>
        <Button onClick={()=> setShowChangePW(!showChangePW)}>Change Password</Button>
        <div class="container mr-auto">
          <ChangePassword />
        </div>
      </div>
    );
  }
}

export default Account;
