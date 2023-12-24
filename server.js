const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');
const path = require('path')
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ตั้งค่าการเชื่อมต่อกับฐานข้อมูล SQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'intern'
});

// เปิดการเชื่อมต่อกับฐานข้อมูล
db.connect((err) => {
    if (err) {
        console.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล: ' + err.stack);
        return;
    }
    console.log('เชื่อมต่อกับฐานข้อมูลเรียบร้อย');
});

// สร้าง WebSocket connection
io.on('connection', (socket) => {
    console.log('ผู้ใช้เชื่อมต่อกับ WebSocket');

    // ดึงข้อมูลจาก SQL และส่งไปยัง client ทุกๆ 1 วินาที
    setInterval(() => {
        db.query('SELECT * FROM users', (err, results) => {
            if (err) throw err;

            // ส่งข้อมูลไปยัง client
            socket.emit('dashboardData', results);
            // console.log(results)
        });
    }, 1000);
});




// เริ่มต้น Express server
const port = 3000;
server.listen(3000, () => {
    console.log('เซิร์ฟเวอร์ทำงานที่ http://localhost:' + port);
});