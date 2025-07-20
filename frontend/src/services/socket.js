import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Update if your backend runs elsewhere

const socket = io(SOCKET_URL, {
  autoConnect: false, // connect manually after login
  transports: ['websocket'],
});

export default socket; 