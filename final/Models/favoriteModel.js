const genericModel = require('./genericMongoDbModel');
const userTable = "User";
const fieldFavoriteMovies = "favMovies";
const fieldFavoriteSeries = "favSeries";
const dateHelper = require('../helpers/DateHelper');
let ObjectID = require("mongodb").ObjectID;

module.exports.findFavoriteMovie= function (idUser, idMovieWatched, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "favMovies.id" : idMovieWatched }, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            callback(false)
        } else {
            callback(true)
        }
    })
};

module.exports.findFavoriteSeries = function (idUser, idSeriesWatched, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "favSeries.id" : idSeriesWatched }, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            callback(false)
        } else {
            callback(true)
        }
    })
};

module.exports.addFavoriteMovie = function (idUser, movie, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "favMovies.id" : movie.id }, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            let objectToAdd = {
                $each : [{
                    id : movie.id,
                    date : dateHelper.getCurrentDate()
                }],
                $position :0
            };
            genericModel.addObjectToTable(userTable, idUser, fieldFavoriteMovies, objectToAdd, (err, result) => {
                if (err) throw err;
                callback(false, result)
            })
        } else {
            callback(true, data)
        }
    })
};

module.exports.addFavoriteSeries = function(idUser, series, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "favSeries.id" : series.id }, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            let objectToAdd = {
                $each : [{
                    id : series.id,
                    date : dateHelper.getCurrentDate()
                }],
                $position :0
            };
            genericModel.addObjectToTable(userTable, idUser, fieldFavoriteSeries, objectToAdd, (err, result) => {
                if (err) throw err;
                callback(false, result)
            })
        } else {
            callback(true, data)
        }
    })
};


module.exports.removeFavoriteMovie = function (idUser, movie, callback) {
    genericModel.removeObjectToTable(userTable, idUser, fieldFavoriteMovies, {id:parseInt(movie)}, (err, result) => {
        callback(err, result)
    })
};

module.exports.removeFavoriteSeries = function(idUser, series, callback) {
    genericModel.removeObjectToTable(userTable, idUser, fieldFavoriteSeries, {id:parseInt(series)}, (err, result) => {
        callback(err, result)
    })
};