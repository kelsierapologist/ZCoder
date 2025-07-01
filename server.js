const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const db = require('./db');
const router = require('./routers');

const PORT = process.env.PORT || 80;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Web Socket connections
const clients = new Set();
wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected');

    ws.on('message', (message) => {
        const msg = JSON.parse(message);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(msg));
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

// DB connections
db.connect();

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

// Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
});

// API
app.use('/api', router);

// Static resources
app.use('/upload', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.join(__dirname, "/../frontend/build")));

app.get('*', (req, res) => {
    try {
        res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
    } catch (error) {
        res.send('Error occurred');
        console.log(error);
    }
});

// CORS
app.use(cors());

// Server listen
server.listen(PORT, () => {
    console.log(`Zcoder backend running on PORT ${PORT}`);
});
