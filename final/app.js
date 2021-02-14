const express         = require('express'),
    session         = require('express-session'),
    cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    http            = require('http'),
    path            = require('path');

let app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.set('port', 6900);

app.use(cookieParser());

app.use(session({
  secret: 'nC0@#1pM/-0qA1+é',
  name: 'Skatos',
  resave: true,
  saveUninitialized: true
}));

app.use(function(request, response, next){
  response.locals.session = request.session;
  app.locals.login = request.session.login;
  next()
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/Views'));
app.use(express.static(path.join(__dirname + '/public')));

require('./router/router')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Server Node.js is listening for requests on port ' + app.get('port'))
});

app.locals.getYear = function (date) {
  if (date)
    return date.split("-")[0];
  return "NAN"
};