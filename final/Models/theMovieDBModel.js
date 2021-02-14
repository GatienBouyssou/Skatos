const key = "api_key=550b1994326f53781e58d9e4c6f6b34a";
const urlTMDB = "https://api.themoviedb.org/3/";
const language = "language=en-UK";
const page = "page=";
const movieDB = "movie/";
const tvDB = "tv/";
const seasonDB = "/season/";
const searchDB = "search/multi";

const topRated = "top_rated";
const upComing = "upcoming";

const movieCredits = "/credits/";

const beginningParams = "?";
const and = "&";
const includeAdult = "include_adult=false";
const queryStr = "query=";

let httpRequest = require("../helpers/HttpRequest");
let urlImage = "http://image.tmdb.org/t/p/w342/";

module.exports.getUpcoming = function (callback) {
    const fullUrl = urlTMDB + movieDB + upComing + beginningParams + language + and + key;
    httpRequest.getResponseHttpRequest(fullUrl, (data) => {
        if (data.status_message) {
            console.log(data.status_message);
            callback([])
        } else {
            callback(data.results)
        }
    })
};

module.exports.getTopRated = function (callback) {
    const fullUrl = urlTMDB + movieDB + topRated + beginningParams + language + and + key;
    httpRequest.getResponseHttpRequest(fullUrl, (data) => {
        if (data.status_message) {
            console.log(data.status_message)
            callback([])
        } else {
            callback(data.results)
        }
    })
};

module.exports.getDetailsMovie = function (id, callback) {
    const fullUrl = urlTMDB + movieDB + id + beginningParams + language + and + key;
    httpRequest.getResponseHttpRequest(fullUrl, (data) => {callback(data)})
};

module.exports.getCreditsMovie = (id, callback) => {
    const fullUrl = urlTMDB + movieDB + id + movieCredits;
    httpRequest.getResponseHttpRequest(fullUrl, (data) => {callback(data)})
}

module.exports.getDetailsTv = function (id, callback) {
    const fullUrl = urlTMDB + tvDB + id + beginningParams + language + and + key;
    httpRequest.getResponseHttpRequest(fullUrl, (data) => {callback(data)})
};

module.exports.searchMulti = function (query, callback) {
    const fullUrl = urlTMDB + searchDB + beginningParams + key + and + language + and + includeAdult + and + queryStr + query;
    httpRequest.getResponseHttpRequest(fullUrl, (data) => {
        if (data.status_message) {
            console.log(data.status_message)
            callback([])
        } else {
            callback(data.results)
        }
    })
};

module.exports.getSeason = function (seriesId, seasonNumber, callback) {
    const fullUrl = urlTMDB + tvDB + seriesId + seasonDB + seasonNumber + beginningParams + key + and + language;
    httpRequest.getResponseHttpRequest(fullUrl, (data) => {
        if (data.status_message) {
            console.log(data.status_message)
            callback(null)
        } else {
            callback(data)
        }
    })
}