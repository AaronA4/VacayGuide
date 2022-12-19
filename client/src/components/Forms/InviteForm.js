import React,{useState} from 'react';

import '../../App.css';
import { useParams } from 'react-router-dom';



function InviteForm(){
	
	const [email, setEmail] = useState("");
	const params = useParams();
	console.log(params);

	const handleSubmit = (e) =>{
		alert(`The email you entered was: ${email}`)
  }
	return (
		<div>
			<h1>Send Invites</h1>
			<h2>Please enter invitee email address</h2>
		<form action = {`http://localhost:3001/schedules/${params.scheduleId}/invite/${params.userId}`} method="Post">
			<label>
				Enter User email:
				<input type="email" value = {email} onChange={(e) => setEmail(e.target.value)}/>
			</label>
			<button onClick = {handleSubmit}>Send Invite</button>
		</form>
		</div>
	)
}

export default InviteForm;