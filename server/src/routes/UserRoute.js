/**
 * @author Agnibha
 * @createdOn 03 17, 2018
 */
const Router = require('express').Router();
const jwtAuth = require('../utils/JWTAuthHelper');
const UserManager = require('../manager/UserManager');
const HTTPStatus = require('http-status');
const WsManager = require('../routes/WsRoute').manager;


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

Router.put("/logout", (req, resp) => {
    "use strict";
    let userId = req.body.userID.id;
    let query = {_id: userId};
    let user = UserManager.getUserByQuery(query);
    user.status = "offline";
    UserManager.updateUser(query, user, {upsert: false});
    resp.status(HTTPStatus.OK).send({"status": "success", "message": "User Status Updates Successfully"});
});

Router.post('/chatFriend', (req, resp) => {
    "use strict";
    let friendEmail = req.body.friendEmail;
    let friend = UserManager.getUserByQuery({email: friendEmail});
    if (friend) {
        if (friend.status === "online") {
            WsManager.publishMessage(friend._id, "startChattingEvent").then(() => {
                resp.status(HTTPStatus.OK).send({"status": "success", message: "User Connected Successfully"});
            }).catch((msg) => {
                resp.status(HTTPStatus.PRECONDITION_FAILED).send({"status": "error", "message": msg});
            })
        } else {
            resp.status(HTTPStatus.PRECONDITION_FAILED).send({"status": "error", "message": "User is not online"});
        }
    } else {
        resp.status(HTTPStatus.NOT_FOUND).send({
            "status": "error",
            "message": `User with email => ${friendEmail} not found`
        });
    }
})


module.exports = Router;