/**
 * @author Agnibha
 * @createdOn 03 18, 2018
 */

const Router = require('express').Router();
const clients = new Map();

Router.ws("/", (ws, req) => {
    "use strict";
    ws.id = req.query.userId;
    clients.set(req.query.userId, ws);
    ws.on('message', msg => {
        let message = JSON.parse(msg);
        if (clients.has(message.destination)) {
            clients.get(message.destination).send(JSON.stringify({"type": "msg", message: message.content}));
        } else {
            ws.send(JSON.stringify({"status": "error", "message": "User Not Connected"}));
        }
    });
    ws.on('error', () => {
        clients.delete(ws.id);
    });
    ws.on('close', () => {
        clients.delete(ws.id);
    })
});

class WebSocketManager {
    publishMessage(channelId, message) {
        return new Promise((resolve, reject) => {
            if (clients.has(channelId)) {
                clients.get(channelId).send(message);
                resolve();
            } else {
                reject("User Is Not Connected");
            }
        });
    }
}

module.exports = {
    manager: new WebSocketManager(),
    Router
};