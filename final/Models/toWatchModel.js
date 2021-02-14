const genericModel = require('./genericMongoDbModel');
const userTable = "User";
const fieldToWatchMovies = "toWatchMovies";
const fieldToWatchSeries = "toWatchSeries";
const dateHelper = require('../helpers/DateHelper');
let ObjectID = require("mongodb").ObjectID;


module.exports.addToWatchMovie = function (idUser, movie, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "toWatchMovies.id" : movie.id }, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            let objectToAdd = {
                $each : [{
                    id : movie.id,
                    date : dateHelper.getCurrentDate()
                }],
                $position :0
            };
            genericModel.addObjectToTable(userTable, idUser, fieldToWatchMovies, objectToAdd, (err, result) => {
                if (err) throw err;
                callback(false, result)
            })
        } else {
            callback(true, data)
        }
    })
};

module.exports.addToWatchSeries = function(idUser, series, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "toWatchSeries.id" : series.id }, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            let objectToAdd = {
                $each : [{
                    id : series.id,
                    date : dateHelper.getCurrentDate()
                }],
                $position :0
            };
            genericModel.addObjectToTable(userTable, idUser, fieldToWatchSeries, objectToAdd, (err, result) => {
                if (err) throw err;
                callback(false, result)
            })
        } else {
            callback(true, data)
        }
    })
};


module.exports.removeToWatchMovie = function (idUser, movie, callback) {
    genericModel.removeObjectToTable(userTable, idUser, fieldToWatchMovies, {id:parseInt(movie)}, (err, result) => {
        callback(err, result)
    })
};

module.exports.removeToWatchSeries = function(idUser, series, callback) {
    genericModel.removeObjectToTable(userTable, idUser, fieldToWatchSeries, {id:parseInt(series)}, (err, result) => {
        callback(err, result)
    })
};