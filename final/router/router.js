let welcomePageController = require("../Controllers/WelcomePageController");
let profileController = require("../Controllers/ProfilePageController");
//let activityController = require("../Controllers/ActivityPageController");
let settingsController = require("../Controllers/SettingsController");
let friendController = require("../Controllers/FriendController");
let theMovieDBController = require("../Controllers/TheMovieDatabaseController");
let authenticationController = require('../Controllers/AuthenticationController');
let toWatchController = require('../Controllers/ToWatchController');
let watchedController = require('../Controllers/WatchedController');
let favoriteController = require('../Controllers/FavoriteController');

module.exports = function(app) {

    app.get('/', welcomePageController.welcomePage);

    app.post('/', welcomePageController.welcomePage);

    app.post("/Connection", authenticationController.connection);

    app.post("/SignUp", authenticationController.signUp);

    /// Get details from the movie database

    app.post('/getDetailsMovie', theMovieDBController.getDetailsMovie);

    app.post('/getDetailsTv', theMovieDBController.getDetailsTv);

    app.post('/searchMovie', theMovieDBController.searchMovie);

    app.get('/Deconnection', authenticationController.deconnection);

    // All the pages when logged

    //Profile page

    app.get('/Profile', profileController.profile);

    app.post('/Profile', profileController.profile);

    app.post('/searchFriend', friendController.searchFriend);

    app.post('/addFriend', friendController.addFriend);

    app.post('/removeFriend', friendController.removeFriend);

    //app.get('/Activity', activityController.activityPage);



    //app.post('/Activity', activityController.activityPage);

    // Settings

    app.post('/Settings', settingsController.settings);

    app.post('/changeImg', settingsController.changeImage);

    app.post('/changeSettings', settingsController.changeSettings);

    app.post('/Friend', friendController.friendPage);

    // TO WATCH

    app.post('/insertMovie', toWatchController.insertMovie);

    app.post('/insertTv', toWatchController.insertTv);

    app.post('/removeMovie', toWatchController.removeMovie);

    app.post('/removeTv', toWatchController.removeTv);

    // WATCHED

    app.post('/changeMovieToWatched', watchedController.setWatchedMovie);

    app.post('/changeSeriesToWatched', watchedController.setWatchedSeries);

    app.post('/removeWatchedTv', watchedController.removeTv);

    app.post('/removeWatchedMovie', watchedController.removeMovie);


    // FAVORITE
    app.post('/addToFavouriteTv', favoriteController.insertTv);

    app.post('/addToFavouriteMovies', favoriteController.insertMovie);

    app.post('/removeToFavouriteTv', favoriteController.removeTv);

    app.post('/removeToFavouriteMovies', favoriteController.removeMovie);

    // STARTED
    app.post('/addToStartedTV', watchedController.setStartedSeries);

    app.post('/removeCurrentSeries', watchedController.removeCurrentSeries);

    app.post('/nextEpisode', watchedController.nextEpisode);

    app.get('*', (req, res) => {res.render('LoggedViews/Pages/ErrorPage')});

    app.post('*', (req, res) => {res.render('LoggedViews/Pages/ErrorPage')});


};