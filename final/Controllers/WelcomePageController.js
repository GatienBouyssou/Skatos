let genericModel = require('../Models/genericMongoDbModel');
let theMovieDBModel = require('../Models/theMovieDBModel');
let async = require('async');
const tmdbHelper = require('../helpers/TMDBHelper');
const resBuilder = require('../helpers/ResponseBuilder');
const NBR_OF_ITEMS_LIMIT = 20;

let ObjectID = require('mongodb').ObjectId;

// get last current watching tv show for each friend + there picture
function getFriendsCurWatching(friends, count, renderData, callback) {
    async.forEachOf(friends, (friend, key, callback) => {
        if (count > NBR_OF_ITEMS_LIMIT) {
            callback();
        } else {
            if (friend.startedSeries) {
                let friendStarted = {};
                friendStarted.profilePicture = friend.profilePicture;
                friendStarted.startedSeries = friend.startedSeries[0];
                renderData.friends.push(friendStarted);
                callback()
            } else {
                callback()
            }
        }
    }, function (err) {
        if (err) throw err;
        callback()
    });
}

module.exports.welcomePage = function(req, res) {
    if (req.session.login) {
        let renderData = {};
        async.parallel([
            function (callback) {
                genericModel.findDocumentById("User", req.session.login, (err, user) => { // get user
                    renderData.name = user.name;
                    renderData.profilePicture = user.profilePicture;
                    renderData.watchLaterMovies = [];
                    renderData.watchLaterSeries = [];
                    renderData.friends = [];
                    if (user.startedSeries)
                        renderData.startedSeries = user.startedSeries;
                    else
                        renderData.startedSeries = [];
                    async.parallel([
                        function(callback) { // get to watch Movies
                            tmdbHelper.getDetailsOfMovie(user.toWatchMovies, NBR_OF_ITEMS_LIMIT,renderData.watchLaterMovies, callback);
                        },
                        function(callback){ // get to watch series
                            tmdbHelper.getDetailsOfTv(user.toWatchSeries, NBR_OF_ITEMS_LIMIT, renderData.watchLaterSeries, callback);
                        },
                        function (callback) {
                            let objectIds = [];
                            user.friends.ids.forEach((friendId)=> { // convert this array to an array of ObjectId useful to mongodb
                                objectIds.push(new ObjectID(friendId))
                            });
                            let count = 0;
                            // get all accounts corresponding to the friends of this user
                            genericModel.findWithQuery("User", {_id: {$in: user.friends.ids}}, (err, friends) => {
                                if (err || friends === null) {
                                    console.log(err);
                                    callback();
                                }  else {
                                    getFriendsCurWatching(friends, count, renderData, callback);
                                }
                            });
                        }
                    ], function (err) {
                        if (err) throw err;
                        callback()
                    });
                })
            },
            function (callback) {
                theMovieDBModel.getUpcoming((data) => {
                    renderData.upcomingMovies = data;
                    callback()
                })
            }
        ], function (err) {
            if (req.method === 'GET'){
                renderData.page = "LoggedViews/Pages/HomePage";
                resBuilder.buildLoggedResponse(renderData);
                res.render('index', renderData)
            } else {
                res.render("LoggedViews/Pages/HomePage", renderData)
            }

        });
    } else if (req.session.errors){
        let renderRes = req.session.errors;
        renderRes.layout = 'Layouts/unloggedLayout';
        req.session.errors = null;
        theMovieDBModel.getTopRated(data => {
            renderRes.topMovies = data;
            renderRes.page = "UnloggedViews/WelcomePage/pageDefault";
            resBuilder.buildUnloggedResponse(renderRes);
            res.render("index", renderRes)
        });
    } else {
        if (req.method === 'GET'){
            theMovieDBModel.getTopRated(data => {
                let renderRes = {
                    topMovies : data,
                    page : "UnloggedViews/WelcomePage/pageDefault"
                };
                resBuilder.buildUnloggedResponse(renderRes);
                res.render("index", renderRes)
            });
        } else {
            res.redirect('/')
        }

    }
};