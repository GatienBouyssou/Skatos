const async = require('async');
let theMovieDBModel = require('../Models/theMovieDBModel');


module.exports.getDetailsOfMovie = function (toWatch, NBR_OF_ITEMS_LIMIT, renderDataArray, callback) {
    async.forEachOf(toWatch, (movie, key, callback) => {
        if (key > NBR_OF_ITEMS_LIMIT) {
            callback();
        } else {
            theMovieDBModel.getDetailsMovie(movie.id, (data) => {
                renderDataArray.push(data);
                callback();
            });
        }

    }, function (err) {
        if (err) throw err;
        callback();
    });
};

module.exports.getDetailsOfTv = function (toWatch, NBR_OF_ITEMS_LIMIT, renderDataArray, callback) {
    async.forEachOf(toWatch, (movie, key, callback) => {
        if (key > NBR_OF_ITEMS_LIMIT) {
            callback();
        } else {
            theMovieDBModel.getDetailsTv(movie.id, (data) => {
                renderDataArray.push(data);
                callback();
            });
        }

    }, function (err) {
        if (err) throw err;
        callback();
    });
};
