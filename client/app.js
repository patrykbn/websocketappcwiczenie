let username = ''

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('alert', ({ content }) => addAlert(content));

const login = (event) => {
    event.preventDefault();

    const submitedUserName = userNameInput.value.trim();
    console.log(submitedUserName);

    if (submitedUserName === '') {
        alert('Please enter a username to chat...');
        return;
    }

    username = submitedUserName;
    socket.emit('userLogin', { userLogin: username })
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
};

const sendMessage = (event) => {
    event.preventDefault();

    const userMessage = messageContentInput.value.trim();
    if (!userMessage) {
        alert('Message cannot be empty');
        return;
    }

    addMessage(username, userMessage);
    socket.emit('message', { author: username, content: userMessage })
    messageContentInput.value = '';
};

const addMessage = (author, content) => {
    const message = document.createElement('li');

    message.classList.add('message', 'message--recieved');
    if (author === username) {message.classList.add('message--self')};
    message.innerHTML = `
        <h3 class='message__author'>${username === author ? 'You' : author}</h3>
        <div class='message__content'>
            ${content}
        </div>
    `;
    messagesList.appendChild(message);
};

const addAlert = (content) => {
    const message = document.createElement('li');

    message.classList.add('message', 'message--alert');
    message.innerHTML = `
        <h3 class='message__author'>Chat Bot</h3>
        <div class='message__content alert'>
            ${content}
        </div>
    `;
    messagesList.appendChild(message);
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);