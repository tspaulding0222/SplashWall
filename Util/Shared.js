var RandManager = require('./RandManager');
var Utils = require('./Utils');

const DOUBLE_TAP_DELAY = 300; // milliseconds
const DOUBLE_TAP_RADIUS = 20;

module.exports = {
    fetchWallsJson: fetchWallsJson,
    isDoubleTap: isDoubleTap
};

function fetchWallsJson(NUM_WALLPAPERS){
    var url = "https://unsplash.it/list";
    return fetch(url)
        .then((response) => response.json())
        .then((jsonData)=> {
            var randomIds = RandManager.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length);
            var walls = [];

            randomIds.forEach((randomId) => {
                walls.push(jsonData[randomId]);
            });

            return walls;
        })
        .catch((error) => {
            console.log('Fetch Error' + error);
        });
}

function isDoubleTap(currentTouchTimeStamp, {x0, y0}, prevTouchInfo){
    var {prevTouchX, prevTouchY, prevTouchTimeStamp} = prevTouchInfo;
    var dt = currentTouchTimeStamp - prevTouchTimeStamp;

    return (dt < DOUBLE_TAP_DELAY && Utils.distance(prevTouchX, prevTouchY, x0, y0) < DOUBLE_TAP_RADIUS);
}