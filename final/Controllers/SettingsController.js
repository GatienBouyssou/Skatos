const genericModel = require('../Models/genericMongoDbModel');
const formValidator = require('../helpers/FormValidator');
const encryptModel = require('../helpers/CryptoHelper');
const userModel = require('../Models/userModel');
const async = require('async');
const formidable = require('formidable');
const fs = require('fs');
const mmm = require('mmmagic');
const Magic = mmm.Magic;
const cryptoHelper = require('../helpers/CryptoHelper');

module.exports.settings = function (req, res) {
    if (!req.session.login) {
        res.redirect("/");
        return;
    }
    genericModel.findDocumentById("User", req.session.login, (err, result) => {
        if (err) {
            res.render('Components/Errors/ErrorServer')
        } else {
            res.render("LoggedViews/Components/SettingsPanel", {user: result})
        }
    });
};

module.exports.changeImage = function (req, res) {
    async.waterfall([
        function (callback) {
            genericModel.findDocumentById("User",req.session.login, (err, user) => { // find the user
                if (err) {
                    callback({status:406, template : "Components/Errors/ErrorServer"}, null)
                } else {
                    callback(null, user)
                }
            })
        },
        function (user, callback) {
            // get incoming form containing an image only
            let form = formidable.IncomingForm({ uploadDir: __dirname + '/../uploads' }); // when a file is uploaded it goes into uploads

            form.parse(req, function (err, fields, files) {
                if (err) {
                    callback({status:406, template: "Components/Errors/ErrorServer"}, null)
                } else {
                    const oldPath = files.profilePicture.path;
                    const extention =  files.profilePicture.type.split('/')[1];
                    const name = user.name + cryptoHelper.hash(files.profilePicture.name) + '.' + extention;
                    const newPath = __dirname + "/../public/images/profiles/" + name;
                    callback(null, oldPath, newPath, name) // return all the elements needed to save the image
                }
            });
        },
        function (oldPath, newPath, name, callback) {
            let magic = new Magic(mmm.MAGIC_MIME_TYPE | mmm.MAGIC_MIME_ENCODING);

            magic.detectFile(oldPath, function(err, result) { // check if the file is an image

                if (err) {
                    callback({status:406, template: "Components/Errors/ErrorServer"}, null)
                } else if (!result.match(/image\//g)) {
                    callback({status:406, template: "Components/Errors/ErrorNotAnImage"}, null)
                } else {
                    fs.rename(oldPath, newPath, function (err) {
                        if (err) {
                            callback({status:406, template: "Components/Errors/ErrorServer"}, null)
                        } else {
                            callback(null, name)
                        }
                    });
                }
            });
        },
        function (nameFile, callback) {
            userModel.modifyProfilePicture(req.session.login, nameFile, (err, result) => {
                if (err) {
                    callback({status:406, template: "Components/Errors/ErrorInsert"}, null)
                } else {
                    callback(null, nameFile)
                }
            })
        }
    ], function (err, result) {
        if (err) {
            res.status(err.status);
            res.render(err.template);
        } else {
            res.send(result)
        }
    })

};

module.exports.changeSettings = function (req, res) {
    let renderRes = {};
    let renderUser = {};
    if (req.session.login) {
        async.waterfall([
            function (callback) {
                genericModel.findDocumentById("User", req.session.login, (err, user) => { // get current user
                    formValidator.checkSettingsForm(user, req.body, (badInputs) => {
                        renderUser = user;
                        if (Object.keys(badInputs).length === 0) {
                            let modif = getModificationUser(req.body); // When a value is null it's not going to be updated
                            callback(null, modif) // go to the next step
                        } else {
                            renderRes = badInputs; // return the form with errors
                            callback(true , null)
                        }
                    })
                })
            },
            function (modifications, callback) {
                userModel.modifyUser(renderUser._id, modifications, (err, result) => {
                    if (err) {
                        renderRes.errorDuringChanges = "Couldn't apply those changes.";
                        callback(true, null)
                    } else {
                        callback()
                    }
                })
            },
            function (callback) {
                genericModel.findDocumentById("User", req.session.login, (err, user) => { // get updated user
                    if (err) {
                        renderRes.errorDuringChanges = "Modifications applied but couldn't get the user.";
                        callback(true, null)
                    } else {
                        renderUser = user;
                        callback()
                    }
                })
            }],
            function (err, result) {
                renderRes.user = renderUser;
                res.render("LoggedViews/Components/SettingsPanel", renderRes)
            })
    } else {
        res.redirect('/')
    }
};

// return all the input that aren't null
function getModificationUser(form) {
    let modif = {};
    if (form.newEmail) {
        modif.email = form.newEmail;
    }
    if (form.newPassword) {
        modif.password = encryptModel.hash(form.newPassword)
    }
    if (form.username){
        modif.name = form.username;
    }
    return modif;
}

