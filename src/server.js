
const WebSocket = require('ws');

const port = 8999


const wss = new WebSocket.Server({ port: port });

console.log(`Waiting for connection in port ${port}..`);

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