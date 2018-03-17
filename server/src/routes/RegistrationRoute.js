/**
 * @author Agnibha
 * @createdOn March 17, 2018
 */

const Router = require('express').Router();
const HTTPStatus = require('http-status');
const UserManager = require('../manager/UserManager');
const bcrypt = require('bcrypt');


Router.post('/', (request, response) => {
    "use strict";
    if (request.body.name && request.body.email && request.body.password) {
        let userByQuery = UserManager.getUserByQuery({email: request.body.email});
        if (!userByQuery) {
            let newUser = {
                name: request.body.name,
                email: request.body.email,
                password: bcrypt.hashSync(request.body.password, 8),
                friends:
                    []
            };
            UserManager.saveUser(newUser);
            response.status(HTTPStatus.OK).send({"status": "success", "message": "User Saved Successfully"});
        } else {
            response.status(HTTPStatus.FORBIDDEN).send({"status": "error", "message": "User with same email exists"});
        }
    } else {
        response.status(HTTPStatus.PRECONDITION_FAILED).send({
            "status": "Error",
            "message": "Registration supports only name and email"
        });
    }
});

module.exports = Router;