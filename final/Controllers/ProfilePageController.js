const genericModel = require('../Models/genericMongoDbModel');
const async = require('async');
const tmdbHelper = require('../helpers/TMDBHelper');
const resBuilder = require('../helpers/ResponseBuilder');
const NBR_OF_ITEMS_LIMIT = 20;
let ObjectID = require('mongodb').ObjectId;

module.exports.profile = function (req, res) {
    if (req.session.login) {
        let renderData  = {};
        genericModel.findDocumentById("User", req.session.login, (err, user) => {
            renderData.profilePicture = user.profilePicture;
            renderData.name = user.name;
            renderData.favMovies = [];
            renderData.favSeries = [];
            renderData.friends = [];
            async.parallel([
                function (callback) {
                    tmdbHelper.getDetailsOfMovie(user.favMovies, NBR_OF_ITEMS_LIMIT, renderData.favMovies, callback)
                },
                function (callback) {
                    tmdbHelper.getDetailsOfTv(user.favSeries, NBR_OF_ITEMS_LIMIT, renderData.favSeries, callback)
                },
                function (callback) {
                    let objectIds = [];
                    user.friends.ids.forEach((friendId)=> {
                        objectIds.push(new ObjectID(friendId))
                    });
                    genericModel.findWithQuery("User", {_id: {$in: objectIds}}, (err, friends) => { // get all the friends of the current user
                        if (err || friends === null) {
                            console.log(err);
                            callback();
                        }  else {
                            async.forEachOf(friends, (friend, key, callback) => { // get the top 20 friends
                                if (key >  NBR_OF_ITEMS_LIMIT){
                                    callback();
                                } else {
                                    renderData.friends.push(friend);
                                    callback()
                                }
                            }, function (err) {
                                if (err) {
                                    callback(err);
                                } else {
                                    callback()
                                }
                            });
                        }
                    });
                }],
                function (err) {
                    if (err) throw err;
                    if (req.method === 'GET'){
                        renderData.page = 'LoggedViews/Pages/ProfilePage';
                        resBuilder.buildLoggedResponse(renderData);
                        res.render('index', renderData)
                    } else {
                        res.render('LoggedViews/Pages/ProfilePage', renderData)
                    }

                })
        });
    } else {
        res.redirect("/");
    }
};