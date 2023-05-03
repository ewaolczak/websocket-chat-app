// Configure Socket.IO
const socket = io();

// Socket listeners
socket.on('message', ({ author, content }) => addMessage(author, content));

// References to HTML elements
const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

// Global variables
let userName = '';

// Functions
const login = (e) => {
  e.preventDefault();
  if (userNameInput.value.length > 0) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    addMessageForm.classList.add('show');
    socket.emit('join', userName);
  } else {
    alert('Please enter a username');
  }
};

const sendMessage = (e) => {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if (messageContent.length > 0) {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = ''; // Dlaczego jak tutaj użyhę messageContent to nie działa?
  } else {
    alert('Please write a message');
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }
  message.innerHTML = `
  <h3 class="message__author">${author === userName ? 'You' : author}</h3>
  <div class="message__content">${content}</div>
  `;
  messagesList.appendChild(message);
};

// Event listeners
loginForm.addEventListener('submit', (e) => login(e));
addMessageForm.addEventListener('submit', (e) => sendMessage(e));
