module.exports = () => {
    res.render('index',
        { links: 'LoggedViews/MainNavigation/links',
            body: 'LoggedViews/MainNavigation/body',
            page: 'LoggedViews/Pages/ErrorPage',
            scripts: 'LoggedViews/MainNavigation/scripts'})
}
