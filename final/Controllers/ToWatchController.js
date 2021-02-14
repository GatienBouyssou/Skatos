const theMovieDB = require('../Models/theMovieDBModel');
const toWatchModel = require('../Models/toWatchModel');
const async = require('async');
const curSeriesModel = require('../Models/startedModel');

module.exports.insertMovie = function (req, res) {
    theMovieDB.getDetailsMovie(req.body.id, data => { // check if movie exists
        if (data.status_code === 34) {
            res.status(403);
            res.render("Components/Errors/ErrorDoesntExist", { movie : data})
        } else {
            toWatchModel.addToWatchMovie(req.session.login, data, (hasBeenAlreadyAdded, result) => {
                if (hasBeenAlreadyAdded) {
                    res.status(406);
                    res.render("Components/Errors/ErrorInsert", { movie : data})
                } else {
                    res.render("Components/Carousel/removableCardMovie", { movie : data})
                }
            });
        }
    });
};

module.exports.insertTv = function (req, res) {
    async.waterfall([
        function (callback) {
            theMovieDB.getDetailsTv(req.body.id, data => { // check if tv show exists
                if (data.status_code === 34) {
                    callback({status : 403, template : "Components/Errors/ErrorDoesntExist"}, null)
                } else {
                    callback(null, data)
                }
            });
        }, function (series, callback) { // check if it's already in the current watching list
            curSeriesModel.findSeriesStarted(req.session.login, series.id, (isAlreadyWatchingIt) => {
                if (isAlreadyWatchingIt) {
                    callback({status : 403, template : "Components/Errors/ErrorAlreadyInCurrentSeries"}, null)
                } else {
                    callback(null, series)
                }
            })
        }, function (series, callback) {
            toWatchModel.addToWatchSeries(req.session.login, series, (hasBeenAlreadyAdded, result) => {
                if (hasBeenAlreadyAdded) {
                    callback({status : 403, template : "Components/Errors/ErrorInsert"}, null)
                } else {
                    callback(null, series)
                }
            });
        }],
        function(err, result) {
            if (err) {
                res.status(err.status);
                res.render(err.template);
            } else {
                res.render("Components/Carousel/removableCardTvShow", { movie : result, series: true})
            }
        })

};

module.exports.removeMovie = function (req, res) {
    toWatchModel.removeToWatchMovie(req.session.login, req.body.id, (err, result) => {
        if(err) {
            res.status(406);
            res.render("Components/Errors/ErrorRemovingItem")
        } else {
            res.status(200);
            res.send({doc: result})
        }
    });
};

module.exports.removeTv = function (req, res) {
    toWatchModel.removeToWatchSeries(req.session.login, req.body.id, (err, result) => {
        if(err) {
            res.status(406);
            res.render("Components/Errors/ErrorRemovingItem")
        } else {
            res.status(200);
            res.send({doc: result})
        }
    });
};