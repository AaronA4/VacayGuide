import axios from 'axios';
import React, {useEffect, useRef, useState, useContext} from 'react';
import {AuthContext} from '../firebase/Auth';
import io from 'socket.io-client';

function Chatroom(props) {
    const currentUser = useContext(AuthContext);
    const [state, setState] = useState({message: '', name: '', schedule: ''});
    const [chat, setChat] = useState([]);
    const socketRef = useRef();
    let {scheduleId} = useParams();

    useEffect(() => {
        console.log('On Chatroom load useEffect')
        async function fetchData() {
            try {
                const {data: chatLog} = await axios.get(`http://localhost:3000/${scheduleId}/chat`);
                setChat(chatLog);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
        socketRef.current = io('/')
        return () => {
            socketRef.current.disconnect();
        };
    }, [scheduleId]);

    useEffect(() => {
        socketRef.current.on('message', ({name, message, schedule}) => {
            setChat([...chat, {name, message}]);
            async function updateLog() {
                try {
                    const {data: chatLog} = await axios.patch(`http://localhost:3000/${scheduleId}`,
                        { chat: chat }
                    );
                } catch (e) {
                    console.log(e);
                }
            }
            updateLog();
        });
        socketRef.current.on('user_join', function (data) {
            setChat([
                ...chat,
                {name: 'ChatBot', message: `${data.name} has joined the chat for ${data.schedule}.`},
            ]);
        });
    }, [chat])

    const userJoin = (name, schedule) => {
        socketRef.current.emit('user_join', ({name, room}));
    };

    const onMessageSubmit = (e) => {
        let msgEle = document.getElementById('message');
        setState({...state, [msgEle.name]: msgEle.value});
        socketRef.current.emit('message', {
            name: state.name,
            message: msgEle.value,
            schedule: state.schedule
        });
        e.preventDefault();
        setState({message: '', name: state.name, room: state.schedule});
        msgEle.value = '';
        msgEle.focus();
    };

    const renderChat = () => {
        return chat.map(({name, message}, index) => {
            <div key={index}>
                <h4>
                    {name}: <span>{message}</span>
                </h4>
            </div>
        });
    };

    if (loading) {
        return (
            <div>
              <h2>Loading. . . .</h2>
            </div>
        );
    } else {
        return (
            <div>
                <div class="content">
                    <br />
                    <h2>Chatroom</h2>
                    <div class="container">
                        <h3 class="container-title">Log</h3>
                        {renderChat()}
                    </div>
                    <form onSubmit={onMessageSubmit}>
                        <h2>Messenger</h2>
                        <div>
                            <input
                                name='message'
                                id='message'
                                variant='outlined'
                                label='Message'
                            />
                        </div>
                        <button type='submit'>Send</button>
                    </form>
                </div>
            </div>
        )
    }
};

export default Chatroom;