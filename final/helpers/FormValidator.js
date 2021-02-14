const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!<>%-.*#?&])[A-Za-z\d@$!%*-<>#.?&]{6,}$/;
const async = require('async');
const genericModel = require('../Models/genericMongoDbModel');

function checkEmails(newEmail, confirmationEmail, errorContainer) {
    if (!emailPattern.test(newEmail)) {
        errorContainer.errorEmail = "Please enter a valid email address."
    } else if (newEmail !== confirmationEmail) {
        errorContainer.errorEmail = "The email addresses doesn't match."
    }
}

function checkPasswords(newPassword, confimationPwd, errorContainer) {
    if (!passwordPattern.test(newPassword)) {
        errorContainer.errorPassword = "Your password must be at least 6 characters long and contain an upper case, a number and a special character"
    } else if (newPassword !== confimationPwd) {
        errorContainer.errorPassword = "The two passwords doesn't match."
    }
}

function checkIfUsernameIsUnique(username, errorContainer, callback) {
    genericModel.findWithQuery("User", {name: username}, function (err, result) {
        if (result.length > 0) {
            errorContainer.errorUsername = "Sorry, the username already exists.";
        }
        callback(err, result)
    })
}

function checkIfEmailIsUnique(email, errorContainer, callback) {
    if (!errorContainer.errorEmail) {
        genericModel.findWithQuery("User", {email: email}, function (err, result) {
            if (result.length > 0) {
                errorContainer.errorEmail = "Sorry, the email address already exists.";
            }
            callback(err, result)
        })
    } else {
        callback()
    }
}

module.exports.checkSignUpForm = function (form, callbackSignUp) {
    let errorContainer = {};
    checkEmails(form.newEmail, form.confirmationEmail, errorContainer);
    checkPasswords(form.newPassword, form.confirmationPassword, errorContainer);
    async.parallel([
        function(callback){
            if (form.username) {
                checkIfUsernameIsUnique(form.username, errorContainer, callback);
            } else {
                errorContainer.username = "The username can't be null"
            }

        },
        function(callback){
            checkIfEmailIsUnique(form.newEmail, errorContainer, callback);
        }], function(err, result) {
        if (err) {
            errorContainer.errorEmail = "Sorry, there was an error during the checking";
        }
        callbackSignUp(errorContainer)
    });

};

function isCurrentEmail(user, form) {
    return user.email !== form.newEmail;
}

function isOneOfTheFieldNull(field1, field2) {
    return field1 || field2;
}

module.exports.checkSettingsForm = function (user, form, callbackSignUp) {
    let errorContainer = {};
    let needToCheckTheEmail = isOneOfTheFieldNull(form.newEmail, form.confirmationEmail) && isCurrentEmail(user, form);
    if (needToCheckTheEmail) {
        checkEmails(form.newEmail, form.confirmationEmail, errorContainer);
    }
    if (isOneOfTheFieldNull(form.newPassword, form.confirmationPassword)) {
        checkPasswords(form.newPassword, form.confirmationPassword, errorContainer);
    }
    async.parallel([
        function(callback){
            if (needToCheckTheEmail) {
                checkIfEmailIsUnique(form.newEmail, errorContainer, callback);
            } else {
                callback()
            }
        },
        function(callback){
            if (user.name !== form.username) {
                checkIfUsernameIsUnique(form.username, errorContainer, callback)
            } else {
                callback()
            }
        }], function(err, result) {
        if (err) {
            errorContainer.errorEmail = "Sorry, there was an error during the checking";
        }
        callbackSignUp(errorContainer)
    });

};