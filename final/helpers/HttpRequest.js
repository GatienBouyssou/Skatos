let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

module.exports.getResponseHttpRequest = function (url, callback) {
    var data = "{}";

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let myArr;
            if (this.status !== 200) {
                callback({status_message:"Can't reach the movie database"})
            } else {
                try {
                    myArr = JSON.parse(this.responseText);

                } catch (e) {
                   myArr = {status_message:"Can't reach the movie database"}
                }
                callback(myArr);
            }


        }
    });

    xhr.open("GET", url);

    xhr.send(data);
};
