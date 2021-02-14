const theMovieDB = require('../Models/theMovieDBModel');
const watchModel = require('../Models/watchedModel');
const startModel = require('../Models/startedModel');
const toWatchModel = require('../Models/toWatchModel');
const async = require('async');
const tmdbModel = require('../Models/theMovieDBModel');


module.exports.setWatchedMovie = function (req, res) {
    async.series({
        removeToWatchList: function(callback){
            toWatchModel.removeToWatchMovie(req.session.login, req.body.id, (err, result) => {
                if (err) {
                    callback(true, 'ErrorRemovingItem')
                } else {
                    callback(null, result)
                }
            })
        },
        addToWatched : function (callback) {
            watchModel.insertWatchedMovie(req.session.login, req.body.id, (err, result) => {
                if (err) {
                    callback(true, 'ErrorInsert')
                } else {
                    callback(null, result)
                }
            })
        }
    }, function (err, result) {
        if (err) {
            res.status(406);
            res.render('Components/Errors/' + result.addToWatched)
        } else {
            res.status(200);
            res.send({result: result})
        }
    });
    /*theMovieDB.getDetailsMovie(req.body.id, (data) => { for the activity page
        const runtime = data.runtime;
        let watchTime = 0;
        data.seasons.forEach(function (season) {
            watchTime += runtime * data.episode_count;
        })
    })*/
};

module.exports.setWatchedSeries = function (req, res) {
    async.series({
        removeToWatchList: function(callback){
            toWatchModel.removeToWatchSeries(req.session.login, req.body.id, (err, result) => {
                if (err) {
                    callback(true, 'ErrorRemovingItem')
                } else {
                    callback(null, result)
                }
            })
        },
        addToWatched : function (callback) {
            watchModel.insertWatchedSeries(req.session.login, req.body.id, (err, result) => {
                if (err) {
                    callback(true, 'ErrorInsert')
                } else {
                    callback(null, result)
                }
            })
        }
    }, function (err, result) {
        if (err) {
            res.status(406);
            res.render('Components/Errors/'+ result.addToWatched)
        } else {
            res.status(200);
            res.send({result: result})
        }
    })
};

module.exports.setStartedSeries = function (req, res) {
    async.waterfall([
        function (callback) {
            theMovieDB.getDetailsTv(req.body.id, (result) => { // check if tv show exists
                if (result.status_message) {
                    callback({status:404, template:'Components/Errors/CantReachTMDB'}, null)
                } else {
                    callback(null, result)
                }
            })
        },
        function (tvShow, callback) {
            startModel.insertStartedSeries(req.session.login, tvShow, (err, result) => {
                if (err) {
                    callback({status: err.status, template:'Components/Errors/customError', resObjects:{message:err.message}}, null)
                } else {
                    callback(null, result)
                }
            })
        },
        function(startedSeason, callback){
            toWatchModel.removeToWatchSeries(req.session.login, req.body.id, (err, result) => { // remove the series of the to watch list
                if (err) {
                    callback({status:406, template:'Components/Errors/ErrorRemovingItem'}, null)
                } else {
                    callback(null, {movie:startedSeason})
                }
            })
        }
    ], function (err, result) {
        if (err) {
            console.log(err);
            res.status(err.status);
            res.render(err.template, err.resObjects);
        } else {
            res.status(200);
            res.render('Components/Carousel/nextCard', result)
        }
    })
};

module.exports.removeMovie = function (req, res) {
    watchModel.removeWatchedMovie(req.session.login, req.body.id, (err, result) => {
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
    watchModel.removeWatchedSeries(req.session.login, req.body.id, (err, result) => {
        if(err) {
            res.status(406);
            res.render("Components/Errors/ErrorRemovingItem")
        } else {
            res.status(200);
            res.send({doc: result})
        }
    });
};

module.exports.removeCurrentSeries = function (req, res) {
    startModel.removeStartedSeries(req.session.login, req.body.id, (err, result) => {
        if(err) {
            res.status(406);
            res.render("Components/Errors/ErrorRemovingItem")
        } else {
            res.status(200);
            res.send({doc: result})
        }
    })
};


module.exports.nextEpisode = function (req, res) {
    async.waterfall([
        function (callback) {
            startModel.findSeriesStarted( req.session.login, req.body.id, (isWatchingIt, curSeries) => {
                if (isWatchingIt) {
                    curSeries.curEpisode ++; // increment number of episode
                    if (curSeries.curEpisode > curSeries.episodeCount) { // if season is finished
                        curSeries.seasonNumber ++; // go to next season
                        tmdbModel.getSeason(req.body.id, curSeries.seasonNumber, (season) => { // get next season
                            if (season) { // if season exists
                                curSeries.episodeCount = season.episodes.length;
                                curSeries.poster_path = season.poster_path;
                                curSeries.curEpisode = 1;
                                curSeries.curSeason = season.name;
                                callback(null, curSeries)
                            } else { // else tv show is finished
                                watchModel.insertWatchedSeries(req.session.login, req.body.id, (err, result) => {
                                    callback({status:403, template : 'Components/BasicMessage/TvShowFinished'})
                                });
                            }
                        })
                    } else {
                        callback(null, curSeries)
                    }
                } else {
                    callback({status:406, template : 'Components/Errors/customError', message:'This Tv show is not in your current watching list.'})
                }
            })
        },
        function (updatedSeries, callback) {
            startModel.updateStartedSeries(req.session.login, req.body.id, updatedSeries, (err, result) => {
                if (err) {
                    callback({status:406, template : 'Components/Errors/customError', message:"Couldn't update the database."})
                } else {
                    callback(null, updatedSeries)
                }
            });
        }],
        function (err, result) {
            if (err) {
                res.status(err.status);
                res.render(err.template, {message: err.message})
            } else {
                res.render('Components/Carousel/nextCard', {movie: result})
            }
        })

};

