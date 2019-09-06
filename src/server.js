const express = require('express');
const WebSocket = require('ws');

const port = 8999

const server = express().listen(port, () => console.log(`Waiting for connection in port ${port}..`));

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {

    console.log('No of clients: ',wss.clients.size)
    
    ws.on('message', (message) => {
        console.log('Received:', message);
        if(message === 'ping'){
            ws.send('pong')
        }
        else{
            broadcast(message, ws);
        }
        
    });

    ws.on('close', () => console.log('Client disconnected'));
});

function broadcast(message, ws) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            if(client !== ws)
                client.send(message);
            else
                client.send(JSON.stringify({client:'You',message: JSON.parse(message).message}));
        }
    });
}