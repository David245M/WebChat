import WebSocket from 'ws'
import config from './config.js'

const server = new WebSocket.Server({ port: config.port });

server.on('connection', (ws, req) => {
    ws.on('message', message => {
        server.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN) {
                const response = JSON.stringify({
                    ...JSON.parse(message), 
                    date: new Date()
                })
                console.log(response)
                client.send(response);
            }
        })
    })
})