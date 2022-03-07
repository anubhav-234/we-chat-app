const socket = io('https://we-chat-app234.herokuapp.com');


// Selecting the elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

//  Function to auto scrool to bottom of Container
function updateScroll(){
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Variables for playing audios at different time (entry , leave and notify)
let userJoin = false;
let userLeave = false;
let userMessage = false;
const notify =  new Audio('notify.mp3');
const leave = new Audio('leave.mp3');
const entry = new Audio('entry.mp3');

// Appending the new div with message in the container of client
const append = (message,position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    updateScroll();
    if(userJoin){
        entry.play();
    }
    else if(userLeave){
        leave.play();
    }
    else if(userMessage && position == 'left' ){
        notify.play();
    }
}

// What to be done when you submit the form
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`,'right');
    socket.emit('send',message);
    messageInput.value = '';
});

// Asking the user for Username
const userName = prompt("Enter your Name to join ");
// Emitting the event 'new-user-joined' when you join the chat
socket.emit('new-user-joined',userName);

// Socket is on for new users to join and to notify you 
socket.on('user-joined',name=>{
    userJoin = true;
    append(`${name} joined the chat `,'left');
    userJoin = false;
});

// Socket is On for new messages you receive 
socket.on('receive',data =>{
    userMessage = true;
    append(`${data.name} : ${data.message}`,'left');
    userMessage = false;
});

// Socket is on for event 'left' which is emiited when someone leaves the chat
socket.on('left',name=>{
    userLeave = true;
    append(`${name} left the chat `, 'left');
    userLeave = false;
})

