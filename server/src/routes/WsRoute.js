/**
 * @author Agnibha
 * @createdOn 03 18, 2018
 */

const Router = require('express').Router();
const clients = new Map();

Router.ws("/", (ws, req) => {
    "use strict";
    ws.id = req.param.id;
    clients.set(req.param.id, ws);
    ws.on('message', msg => {
        let message = JSON.parse(msg);
        if (clients.has(message.destination)) {
            clients.get(message.destination).send(message.content);
        } else {
            ws.send(JSON.stringify({"status": "error", "message": "User Not Connected"}));
        }
    });
});


module.exports = Router;