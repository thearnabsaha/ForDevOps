import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// HTTP route
app.get('/', (req, res) => {
    res.send('WebSocket server is running! 💖');
});

// Create HTTP server to attach WebSocket server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Broadcast function
const broadcast = (message: string, sender: WebSocket) => {
    wss.clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected 💫');

    ws.on('message', (data) => {
        console.log(`Received: ${data}`);
        broadcast(data.toString(), ws);
    });

    ws.on('close', () => {
        console.log('Client disconnected 💔');
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
