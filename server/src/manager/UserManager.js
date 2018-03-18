/**
 * @author Agnibha
 * @createdOn 03 17, 2018
 */

const DB = require('diskdb');
DB.connect(appConfig.DB_PATH, ['users'])

class UserManager {
    saveUser(user) {
        DB.users.save(user);
    }

    getUserByQuery(query) {
        return DB.users.findOne(query);
    }

    getBasicUserInfo(query) {
        let userInfo = DB.users.findOne(query);
        delete userInfo.password;
        return userInfo;
    }

    updateUser(query, newValue, options) {
        DB.users.update(query, newValue, options);
    }
}

module.exports = new UserManager();