/**
 * @author Agnibha
 * @createdOn 03 18, 2018
 */

const Router = require('express').Router();
const clients = [];

Router.ws('/', (ws, req) => {
    "use strict";
    console.log(`WS ID => ${ws.id}`);
    console.log(`Request Body Params => ${JSON.stringify(req.body)}`);
    ws.on('message', msg => {
        ws.send(msg);
    });
});

module.exports = Router;