document.addEventListener('DOMContentLoaded', () => {
    const socket = io('https://socketchat-35zk.onrender.com', {
        transports: ['websocket', 'polling']
    });

    const form = document.getElementById('chat-form');
    const input = document.getElementById('message-input');
    const messages = document.getElementById('messages');
    const status = document.getElementById('status');

    // Color mapping for each socket ID
    const colorMapping = {};

    socket.on('connect', () => {
        status.textContent = 'Connected to server';
        status.style.color = 'green';
    });

    socket.on('disconnect', () => {
        status.textContent = 'Disconnected from server';
        status.style.color = 'red';
    });

    socket.on('welcome', (msg) => {
        addMessage(msg, socket.id); // Use the socket ID
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value.trim()) {
            socket.emit('chat message', { id: socket.id, message: input.value });
            input.value = '';
        }
    });

    socket.on('chat message', (data) => {
        if (!colorMapping[data.id]) {
            colorMapping[data.id] = getRandomColor();
        }
        addMessage(data.message, data.id);
    });

    function addMessage(msg, id) {
        const li = document.createElement('li');
        li.textContent = msg;
        li.style.color = colorMapping[id] || 'black';
        messages.appendChild(li);
        messages.scrollTop = messages.scrollHeight;
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
