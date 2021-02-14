module.exports.getCurrentDate = function () {
    let today = new Date();

    let min = String(today.getMinutes());
    let hh = String(today.getHours());
    let dd = String(today.getDate());
    let mm = String(today.getMonth() + 1); //January is 0!
    let yyyy = today.getFullYear();

    return yyyy+'/'+mm+'/'+ dd+ '-' +  hh+ ':' + min;
};