/**
 * @author Agnibha
 * @createdOn 03 17, 2018
 */

const Router = require('express').Router();
const jwt = require('jsonwebtoken');
const HTTPStatus = require('http-status');
const bcrypt = require('bcrypt');
const UserManager = require('../manager/UserManager');

Router.post('/', (request, response) => {
    "use strict";
    if (request.body.email && request.body.password) {
        let query = {
            email: request.body.email
        };
        let user = UserManager.getUserByQuery(query);
        if (user && bcrypt.compareSync(request.body.password, user.password)) {
            let token = jwt.sign({
                id: user._id
            }, appConfig.APP_SECRET, {
                expiresIn: 86400
            });
            user.status = "online";
            UserManager.updateUser(query, user, {
                upsert: false
            });
            delete user['password'];
            response.status(HTTPStatus.OK).send({
                "status": "success",
                "message": "Auth Success",
                "token": token,
                "user": user
            });
        } else {
            response.status(HTTPStatus.UNAUTHORIZED).send({
                "status": "error",
                "message": "Invalid Creds"
            });
        }
    }
});

module.exports = Router;