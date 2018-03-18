/**
 * @author Agnibha
 * @createdOn 03 17, 2018
 */
const Router = require('express').Router();
const jwtAuth = require('../utils/JWTAuthHelper');
const UserManager = require('../manager/UserManager');
const HTTPStatus = require('http-status');

Router.use(jwtAuth);

Router.get('/', (req, resp) => {
    "use strict";
    let userId = req.body.userID.id;
    let user = UserManager.getBasicUserInfo({_id: userId});
    let friends = [];
    user.friends.forEach(friend => {
        let friendObj = UserManager.getBasicUserInfo({_id: friend});
        delete friendObj.friends;
        friends.push(friendObj);
    });
    user.friends = friends;
    return resp.status(HTTPStatus.OK).send({status: "success", user});
});

Router.put("/updateStatus", (req, resp) => {
    "use strict";
    let userId = req.body.userID.id;
    let query = {_id: userId};
    let user = UserManager.getUserByQuery(query);
    user.status = "online";
    UserManager.saveUser(query, user, {upsert: false});
    resp.status(HTTPStatus.OK).send({"status": "success", "message": "User Logged in Successfully"});
});



module.exports = Router;