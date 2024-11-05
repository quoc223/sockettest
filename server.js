const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Cho phép tất cả các origin trong môi trường development
        methods: ["GET", "POST"]
    }
});

// Phục vụ files tĩnh từ thư mục public
app.use(express.static('public'));

// Đường dẫn gốc
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('Một người dùng đã kết nối - ID:', socket.id);

    // Gửi thông báo chào mừng
    socket.emit('welcome', 'Chào mừng bạn đến với chat!');

    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Người dùng đã ngắt kết nối - ID:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
