const theMovieDB = require('../Models/theMovieDBModel');
const watchedModel = require('../Models/watchedModel');
const startedModel = require('../Models/startedModel');
const favoriteModel = require('../Models/favoriteModel');
const async = require('async');

module.exports.getDetailsMovie = function (req, res) {
    let renderData = {};
    if (req.session.login){
        async.parallel([
                function (callback) {
                    theMovieDB.getDetailsMovie(req.body.id, data => {
                        if (data == null) {
                            callback(true)
                        } else {
                            renderData.movie = data;
                            callback()
                        }
                    });
                },
                function (callback) { // get if the movie is already watched
                    watchedModel.findMovieWatched(req.session.login, parseInt(req.body.id), isWatched => {
                        renderData.isWatched = isWatched;
                        callback()
                    })
                },
                function (callback) { // get if the movie is favorite
                    favoriteModel.findFavoriteMovie(req.session.login, parseInt(req.body.id), isFavorite => {
                        renderData.isFavorite = isFavorite;
                        callback()
                    })
                },
                function (callback) {
                    theMovieDB.getCreditsMovie(req.body.id, data => {
                        if (data == null) {
                            callback(true)
                        } else {
                            renderData.credits = data;
                            callback()
                        }
                    })
                }],
            function (err) {
                if (err) {
                    res.status(403);
                    res.render("Components/Errors/ErrorServer", renderData)
                } else {
                    res.render("Components/Modals/movieModal", renderData)
                }

            });
    } else {
        theMovieDB.getDetailsMovie(req.body.id, data => {
            res.render("Components/Modals/movieModal", {movie:data})
        });
    }
};

module.exports.getDetailsTv = function (req, res) {
    let renderData = {};
    if (req.session.login) {
        async.parallel([
                function (callback) {
                    theMovieDB.getDetailsTv(req.body.id, data => {
                        if (data == null) {
                            callback(true)
                        } else {
                            renderData.movie = data;
                            callback()
                        }
                    });
                },
                function (callback) { // get if series watched
                    watchedModel.findSeriesWatched(req.session.login, parseInt(req.body.id), isWatched => {
                        renderData.isWatched = isWatched;
                        callback()
                    })
                },
                function (callback) { // get if series favorite
                    startedModel.findSeriesStarted(req.session.login, parseInt(req.body.id), isStarted => {
                        renderData.isStarted = isStarted;
                        callback()
                    })
                },
                function (callback) {
                    favoriteModel.findFavoriteSeries(req.session.login, parseInt(req.body.id), isFavorite => {
                        renderData.isFavorite = isFavorite;
                        callback()
                    })
                }],
            function (err) {
                if (err) {
                    res.status(403);
                    res.render("Components/Errors/ErrorServer", renderData)
                } else {
                    res.render("Components/Modals/tvModal", renderData)
                }

            });
    } else {
        theMovieDB.getDetailsTv(req.body.id, data => {
            res.render("Components/Modals/tvModal", {movie:data})
        });
    }

};

module.exports.searchMovie = function (req, res) {
    theMovieDB.searchMulti(req.body.query, data => {
        res.render("Components/Modals/itemSearchResult", {movies : data})
    });
};

