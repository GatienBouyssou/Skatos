const friendModel = require('../Models/friendModel');
const genericModel = require('../Models/genericMongoDbModel');
const async = require('async');
const tmdbHelper = require('../helpers/TMDBHelper');
const NBR_OF_ITEMS_LIMIT = 20;
const resBuilder = require('../helpers/ResponseBuilder');

let ObjectID = require('mongodb').ObjectId;


function getProfileWithName(req, callback) {
    genericModel.findWithQuery("User", {name: req.body.name}, (err, users) => {
        if (users === null) {
            callback({status:403, message:"Friend can't be found !"});
        }
        const user = users[0];
        let renderData  = {};
        renderData._id = user._id;
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
                    user.friends.ids.forEach((friendId) => {
                        objectIds.push(new ObjectID(friendId))
                    });
                    genericModel.findWithQuery("User", {_id: {$in: objectIds}}, (err, friends) => { // get all the friends of the current user
                        if (err || friends === null) {
                            callback({status:403, message: 'Error while getting your friend friends'});
                        } else {
                            async.forEachOf(friends, (friend, key, callback) => { // select only the top 20 friends
                                if (key > NBR_OF_ITEMS_LIMIT) {
                                    callback();
                                } else {
                                    renderData.friends.push(friend);
                                    callback()
                                }
                            }, function (err) {
                                callback()
                            });
                        }
                    });
                }],
            function (err) {
                if (err) {
                    callback(err)
                } else {
                    callback(null, renderData)
                }
            })
    });
}

module.exports.friendPage = function (req, res) {
    if (req.session.login) {
        async.waterfall([
            function (callback) {
                getProfileWithName(req, callback);
            },
            function (renderData, callback) {
                // check if the requested user is friend with the current user
                friendModel.hasThisFriend(req.session.login,renderData._id, (hasThisFriend, friend) => {
                    renderData.hasThisFriend = hasThisFriend;
                    callback(null, renderData)
                })
            }
            ],
            function (err, renderData) {
                if (err) {
                    res.status(err.status);
                    res.render('Components/Errors/customError', err)
                } else {
                    res.render('LoggedViews/Components/FriendPage', renderData)
                }

            })

    } else {
        res.redirect("/");
    }
};

module.exports.searchFriend = function (req, res) {
    if (req.session.login) {
        friendModel.searchUsersByName(req.session.login, req.body.query, (err, result) => {
            if (err) {
                res.status(404);
                res.send(err);
            } else {
                res.render('Components/Modals/friendSearchResult', {friends: result})
            }
        })
    } else {
        res.redirect("/")
    }
};

module.exports.addFriend = function (req, res) {
    if (req.session.login) {
        friendModel.findFriendByName(req.session.login, req.body.name, (err, user) => { //check if user exists
            if(user.length > 0) {
                friendModel.addFriend(req.session.login, user[0]._id, (err, result) => {
                    if (err) {
                        res.status(406);
                        res.render("Components/Errors/customError", { message : 'You are already following this person.'})
                    } else {
                        res.render('Components/Carousel/friendCarousel', {friend: user[0]})
                    }
                })
            } else {
                res.status(403);
                res.send(err)
            }
        })
    } else {
        res.redirect("/")
    }
};

module.exports.removeFriend = function(req, res) {
    if (req.session.login) {
        friendModel.findFriendByName(req.session.login, req.body.name, (err, user) => { // check if user exists
            if(user.length > 0) {
                friendModel.removeFriend(req.session.login, user[0]._id, (err, result) => {
                    if (err) {
                        res.status(406);
                        res.render("Components/Errors/ErrorRemovingItem", { movie : data})
                    } else {
                        res.status(200);
                        res.send(result)
                    }
                })
            } else {
                res.status(403);
                res.send(err)
            }
        })
    } else {
        res.redirect("/")
    }
};