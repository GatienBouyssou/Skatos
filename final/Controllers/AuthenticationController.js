const genericModel = require('../Models/genericMongoDbModel');
const encryptModel = require('../helpers/CryptoHelper');
const formValidator = require('../helpers/FormValidator');

function buildNewUser(form){
    return {
        name: form.username,
        password: encryptModel.hash(form.newPassword),
        profilePicture: "person.png",
        email: form.newEmail,
        friends: {ids: []},
        favMovies: [],
        favSeries: [],
        toWatchMovies: [],
        toWatchSeries: [],
        watchedMovies: [],
        watchedSeries: [],
        currentSeries : [],
        stats: {
            totalWatchTime: 0,
            seriesWatchTime: 0,
            movieWatchTime: 0,
            mostWatchGenre: ""
        }
    }
}

module.exports.connection = function(req, res) {
    let userInformation = {
        email : req.body.email,
        password : encryptModel.hash(req.body.password)
    };
    // check if a user with those information exists
    genericModel.findWithQuery("User", userInformation, (err, results) => {
        if(err) throw err;
        if (results.length > 0){
            req.session.login = results[0]._id; // if he exists set session
        } else {
            let renderRes = {};
            renderRes.errorConnection = "Invalid email or password. Please try again.";
            req.session.errors = renderRes;// else return to connection screen
        }
        res.redirect('/');
    });

};

module.exports.signUp = function (req, res) {
    formValidator.checkSignUpForm(req.body, (renderRes)=> {
        if (Object.keys(renderRes).length === 0) { // if the sign up form is clean
            let newUser = buildNewUser(req.body);
            genericModel.insertOneDocument("User", newUser, (err, result) => { // create User
                if (err) {
                    throw err;
                } else {
                    req.session.login = result.ops[0]._id; // log in
                    res.redirect('/');
                }
            });
        } else { // else back to sign up form
            renderRes.signUpRes = true;
            req.session.errors = renderRes;
            res.redirect('/')
        }
    });
};

module.exports.deconnection = function (req, res) {
    req.session.login = null;
    res.redirect("/");
};



