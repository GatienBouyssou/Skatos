
module.exports.buildLoggedResponse = function (renderRes) {
    renderRes.links ='LoggedViews/MainNavigation/links';
    renderRes.body = 'LoggedViews/MainNavigation/body';
    renderRes.scripts = 'LoggedViews/MainNavigation/scripts';
};

module.exports.buildUnloggedResponse = function (renderRes) {
    renderRes.links = 'UnloggedViews/WelcomePage/links';
    renderRes.body = 'UnloggedViews/WelcomePage/body';
    renderRes.scripts = 'UnloggedViews/WelcomePage/scripts';
};