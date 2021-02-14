const genericModel = require('../Models/genericMongoDbModel');
const ObjectID = require('mongodb').ObjectId;

module.exports.modifyUser = function (userId, modifications, callback) {
    genericModel.updateOneDocument("User", {_id: new ObjectID(userId)}, {$set:modifications}, (err, result) => {
        callback(err, result)
    })
};

module.exports.modifyProfilePicture = function (userId, modifications, callback) {
    genericModel.updateOneDocument("User", {_id: new ObjectID(userId)}, {$set:{profilePicture:modifications}}, (err, result) => {
        callback(err, result)
    })
};