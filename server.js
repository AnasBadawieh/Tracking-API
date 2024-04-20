const express = require('express');
const http = require('http');
const WebSocketServer = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer.Server({ server });

const sharedData = {};
const busSharedData = {};

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace * with the specific origin you want to allow, or use '*' to allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
        res.sendStatus(200); 
    } else {
        next(); 
    }
});
app.post('/trackerdata/update-bus-data', (req, res) => {
    const newData = req.body;
    Object.assign(busSharedData, newData);
    res.sendStatus(200);
});

// Endpoint to get busSharedData
app.get('/trackerdata/bus-shared-data', (req, res) => {
    res.json(busSharedData);
});

app.post('/trackerdata/delete-user-data', (req, res) => {
    const { userId } = req.body;
    if (sharedData[userId]) {
        delete sharedData[userId]
    }
    res.sendStatus(200);
});

app.post('/trackerdata/delete-all-users', (req, res) => {
    Object.keys(sharedData).forEach(userId => {
        delete sharedData[userId]
    });
    res.sendStatus(200);
});

app.post('/trackerdata/update-shared-data', (req, res) => {
    try {
        const newData = req.body;
        Object.assign(sharedData, newData);  // Update sharedData with newData

        // Broadcast the updated data to all connected WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'update',
                    data: sharedData
                }));
            }
        });

        res.sendStatus(200);  // Send HTTP status 200 OK if everything is fine
    } catch (error) {
        console.error('Failed to process data:', error);
        res.status(500).send('Internal Server Error');  // Send HTTP status 500 if an error occurs
    }
});




app.get('/trackerdata/shared-data', (req, res) => {
    res.json(sharedData);
});

// WebSocket server logic
wss.on('connection', ws => {
    console.log('Client connected');
    
    // Send initial shared data to newly connected client
    ws.send(JSON.stringify(sharedData));
    // Existing WebSocket connection handling
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            const data = JSON.parse(message);
            switch (data.type) {
                case 'stopTracking':
                    if (data.userId) {  // Stop tracking for specific user
                        wss.clients.forEach(function each(client) {
                            if (client !== ws && client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({ type: 'stopTracking', userId: data.userId }));
                            }
                        });
                    } else {  // Stop tracking for all users
                        wss.clients.forEach(function each(client) {
                            if (client !== ws && client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify({ type: 'stopTrackingAll' }));
                            }
                        });
                    }
                    break;
            // Handle other message types as needed
            }
        });
    });

    // Handle messages from clients (if needed)
    ws.on('message', message => {
        console.log('Received message from client:', message);
        // You can add custom message handling logic here if needed
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
