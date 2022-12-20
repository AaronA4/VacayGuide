import React,{useState} from 'react';

import '../../App.css';
import { useParams } from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';
import firebase from 'firebase/app';
import { getSessionToken } from '../firebase/FirebaseFunctions';


function InviteForm(){

	const {currentUser} = useContext(AuthContext);
	const [userEmail,setUserEmail] = useState(currentUser.email);
	const email = firebase.auth().currentUser.email;
	const accessToken = getSessionToken();
	const headers = {headers: {
		email : email,
		accesstoken: accessToken
	}};
	const params = useParams();
	console.log(params);

	const handleSubmit = async (e) =>{
		e.preventDefault();
		setUserEmail(currentUser.email);
		console.log(currentUser);
		try {
			await axios.post(`http://localhost:3001/schedules/${params.scheduleId}/invite`,{userEmail},headers);
	} catch (e) {
			console.log(e);
	}
  }
	return (
		<div>
			<h1>Send Invites</h1>
			<h2>Please enter invitee email address</h2>
		<form onSubmit={handleSubmit}>
			<label>
				Enter User email:
				<input type="email" value = {email} onChange={(e) => setUserEmail(e.target.value)}/>
			</label>
			<input type="submit"/>
		</form>
		</div>
	)
}

export default InviteForm;