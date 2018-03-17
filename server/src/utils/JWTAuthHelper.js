/**
 * @author Agnibha
 * @createdOn 03 17, 2018
 */

const HTTPStatus = require('http-status');
const jwt = require('jsonwebtoken');


module.exports = (req, resp, next) => {
    "use strict";
    let userToken = req.header('x-access-token');
    if (!userToken) {
        return resp.status(HTTPStatus.UNAUTHORIZED).send({
            "status": "error",
            "message": "Unauthorized Access"
        });
    }
    jwt.verify(userToken, appConfig.APP_SECRET, (err, decoded) => {
        if (err) {
            return resp.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
                "status": "error",
                "message": "Unable To Verify User Token"
            });
        }
        req.body.userID = decoded;
        next();
    });
};