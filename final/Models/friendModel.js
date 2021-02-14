const genericModel = require('./genericMongoDbModel');
const userTable = "User";
const dateHelper = require('../helpers/DateHelper');
let ObjectID = require("mongodb").ObjectID;


module.exports.searchUsersByName = function (idUser, name, callback) {
    const nameSearched = ".*"+name+".*";
    genericModel.findWithQuery(userTable, {"name": new RegExp(nameSearched), _id :{$ne: new ObjectID(idUser)}}, (err, result) => {
        callback(err, result)
    })
};

module.exports.findFriendByName = function (idUser, name, callback) {
    genericModel.findWithQuery(userTable, {name : name, _id :{$ne: new ObjectID(idUser)}}, (err, result) => {
        callback(err, result)
    })
};

function checkIfHasThisFriend(idUser, idFriend, callback) {
    genericModel.findWithQuery(userTable, {
        _id: new ObjectID(idUser),
        "friends.ids": new ObjectID(idFriend)
    }, (err, data) => {
        if (err || data.length === 0) {
            callback(false, null)
        } else {
            callback(true, data)
        }
    })
}

module.exports.hasThisFriend = function (idUser, idFriend, callback) {
    checkIfHasThisFriend(idUser, idFriend, callback);
}

module.exports.addFriend = function(idUser, idFriend, callback){
    checkIfHasThisFriend(idUser, idFriend, (hasThisFriend, friend) => {
        if (hasThisFriend) {
            callback(true, friend)
        } else {
            let objectToAdd = {
                $each:[idFriend]
                ,$position:0
            };
            genericModel.addObjectToTable(userTable, idUser, "friends.ids", objectToAdd, (err, result) => {
                if (err) throw err;
                callback(false, result)
            })
        }
    })
};

module.exports.removeFriend = function(idUser, idFriend, callback){
    genericModel.removeObjectToTable(userTable, idUser, "friends.ids", new ObjectID(idFriend), (err, result) => {
        callback(err, result)
    })
};

