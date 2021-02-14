const genericModel = require('./genericMongoDbModel');
const userTable = "User";
let ObjectID = require("mongodb").ObjectID;
const fieldWatchedMovies = "watchedMovies";
const fieldWatchedSeries = "watchedSeries";
const dateHelper = require('../helpers/DateHelper');

module.exports.findMovieWatched = function (idUser, idMovieWatched, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "watchedMovies.id" : parseInt(idMovieWatched)}, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            callback(false)
        } else {
            callback(true)
        }
    })
};

module.exports.findSeriesWatched = function (idUser, idSeriesWatched, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "watchedSeries.id" : parseInt(idSeriesWatched)}, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            callback(false)
        } else {
            callback(true)
        }
    })
};

module.exports.insertWatchedMovie = function (idUser, idMovie, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "watchedMovies.id" : parseInt(idMovie)}, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            let objectToAdd = {
                $each : [{
                    id : parseInt(idMovie),
                    date : dateHelper.getCurrentDate()
                }],
                $position :0
            };
            genericModel.addObjectToTable(userTable, idUser, fieldWatchedMovies, objectToAdd, (err, result) => {
                if (err) throw err;
                callback(false, result)
            })
        } else {
            callback(true, data)
        }
    })
};

module.exports.insertWatchedSeries = function (idUser, idSeries, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "watchedSeries.id" : parseInt(idSeries)}, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            let objectToAdd = {
                $each : [{
                    id : parseInt(idSeries),
                    date : dateHelper.getCurrentDate()
                }],
                $position :0
            };
            genericModel.addObjectToTable(userTable, idUser, fieldWatchedSeries, objectToAdd, (err, result) => {
                if (err) {
                    callback(true, null)
                } else {
                    callback(false, result)
                }
            })
        } else {
            callback(true, data)
        }
    })
};

module.exports.removeWatchedMovie = function (idUser, idMovie, callback) {
    genericModel.removeObjectToTable(userTable, idUser, fieldWatchedMovies, {id:parseInt(idMovie)}, (err, result) => {

        callback(err, result)
    })
};

module.exports.removeWatchedSeries = function (idUser, idSeries, callback) {
    genericModel.removeObjectToTable(userTable, idUser, fieldWatchedSeries, {id:parseInt(idSeries)}, (err, result) => {
        callback(err, result)
    })
};