const resHelper = require('../helpers/ResponseBuilder');

module.exports.activityPage = function (req, res) {
    if (req.session.login) {
        if (req.method === 'GET') {
            let renderRes = {
                page : "LoggedViews/Pages/ActivityPage"
            };
            resHelper.buildLoggedResponse(renderRes);
            res.render('index', renderRes);
        } else {
            res.render("LoggedViews/Pages/ActivityPage");
        }
    } else {
        res.redirect("/");
    }
};