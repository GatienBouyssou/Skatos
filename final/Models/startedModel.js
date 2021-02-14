const genericModel = require('./genericMongoDbModel');
const userTable = "User";
let ObjectID = require("mongodb").ObjectID;
const fieldStartedSeries = "startedSeries";
const dateHelper = require('../helpers/DateHelper');

module.exports.findSeriesStarted = function (idUser, idSeriesStarted, callback) {
    let filter = {
        input:"$startedSeries",
        as: 'startedSeries',
        cond:{$eq: ["$$startedSeries.id", parseInt(idSeriesStarted)]}
    };
    genericModel.findOneElementOfArray(userTable, new ObjectID(idUser), filter, (err, data) => {
        if (err) throw err;
        if(data[0].startedSeries === null){
            callback(false, null)
        } else if (data[0].startedSeries.length > 0) {
            callback(true, data[0].startedSeries[0])
        } else {
            callback(false, null)
        }
    })
};

function buildStartedSeries(series, startedSeries) {
    series.seasons.forEach((season) => {
        if (season.season_number === 1) {
            startedSeries.id= parseInt(series.id);
            startedSeries.name = series.name;
            if (season.poster_path)
                startedSeries.poster_path = season.poster_path;
            else
                startedSeries.poster_path = series.poster_path;
            startedSeries.episodeCount = season.episode_count;
            startedSeries.seasonNumber = season.season_number;
            startedSeries.curEpisode = 1;
            startedSeries.curSeason = season.name;
            startedSeries.date = dateHelper.getCurrentDate();
            return;
        }
    });
}

module.exports.insertStartedSeries = function (idUser, series, callback) {
    genericModel.findWithQuery(userTable, {_id : new ObjectID(idUser), "startedSeries.id" : parseInt(series.id)}, (err, data) => {
        if (err) throw err;
        if (data.length === 0) {
            let startedSeason = {};
            buildStartedSeries(series, startedSeason);
            if (Object.keys(startedSeason).length !== 0) {
                const objectToAdd = {
                    $each : [startedSeason],
                    $position : 0
                };
                genericModel.addObjectToTable(userTable, idUser, fieldStartedSeries, objectToAdd, (err, result) => {
                    if (err) {
                        callback(true, null)
                    } else {
                        callback(false, startedSeason)
                    }
                })
            } else {
                callback({status :406, message :'Season 1 not found !'})
            }
        } else {
            callback({status :409, message : 'You are already watching this tv show'})
        }
    })
};

module.exports.removeStartedSeries = function (idUser, idSeries, callback) {
    genericModel.removeObjectToTable(userTable, idUser, fieldStartedSeries, {id:parseInt(idSeries)}, (err, result) => {
        callback(err, result)
    })
};

module.exports.updateStartedSeries = function (idUser, idSeries, toUpdate, callback) {
    genericModel.updateOneDocument(userTable,
        {_id: new ObjectID(idUser), "startedSeries.id": parseInt(idSeries)},
        {$set: {"startedSeries.$":toUpdate}},
        (err, result) => {
            callback(err, result)
        })
};