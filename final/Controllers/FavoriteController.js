const theMovieDB = require('../Models/theMovieDBModel');
const favoriteModel = require('../Models/favoriteModel');
const async = require('async');

module.exports.insertMovie = function (req, res) {
    async.waterfall([
        function (callback) {
            theMovieDB.getDetailsMovie(req.body.id, data => { // check if movie exists
                if (data.status_code === 34) {
                    callback({status: 403, template: "Components/Errors/ErrorDoesntExist"}, null);
                } else {
                    callback(null, data);
                }
            });
        },
        function (movie, callback) {
            favoriteModel.addFavoriteMovie(req.session.login, movie, (hasBeenAlreadyAdded, result) => {
                if (hasBeenAlreadyAdded) {
                    callback({status: 406, template: "Components/Errors/ErrorInsert"}, null);
                } else {
                    callback(null, movie)
                }
            });
        }],
        function (err, result) {
            if (err) {
                res.status(err.status);
                res.render(err.template);
            } else {
                res.render("Components/Carousel/showItemWithPopup", {movie: result})
            }
        })

};

module.exports.insertTv = function (req, res) {
    async.waterfall([
            function (callback) {
                theMovieDB.getDetailsTv(req.body.id, data => { // check if tv show exists
                    if (data.status_code === 34) {
                        callback({status: 403, template: "Components/Errors/ErrorDoesntExist"}, null);
                    } else {
                        callback(null, data);
                    }
                });
            },
            function (series, callback) {
                favoriteModel.addFavoriteSeries(req.session.login, series, (hasBeenAlreadyAdded, result) => {
                    if (hasBeenAlreadyAdded) {
                        callback({status: 406, template: "Components/Errors/ErrorInsert"}, null);
                    } else {
                        callback(null, series)
                    }
                });
            }],
        function (err, result) {
            if (err) {
                res.status(err.status);
                res.render(err.template);
            } else {
                res.render("Components/Carousel/showTVShowWithPopup", {movie:result})
            }
        })
};

module.exports.removeMovie = function (req, res) {
    favoriteModel.removeFavoriteMovie(req.session.login, req.body.id, (err, result) => {
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
    favoriteModel.removeFavoriteSeries(req.session.login, req.body.id, (err, result) => {
        if(err) {
            res.status(406);
            res.render("Components/Errors/ErrorRemovingItem")
        } else {
            res.status(200);
            res.send({doc: result})
        }
    });
};