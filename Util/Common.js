import React from 'react';
import {
    View,
    Text
} from 'react-native';

const DOUBLE_TAP_DELAY = 300; // milliseconds
const DOUBLE_TAP_RADIUS = 20;
const NUM_WALLPAPERS = 5;

function distance(x0, y0, x1, y1){
    return Math.sqrt( Math.pow(( x1 - x0 ), 2) + Math.pow(( y1 - y0 ), 2) );
}

function fetchWallsJson(NUM_WALLPAPERS){
    var url = "https://unsplash.it/list";
    return fetch(url)
        .then((response) => response.json())
        .then((jsonData)=> {
            var randomIds = uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length);
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

    return (dt < DOUBLE_TAP_DELAY && distance(prevTouchX, prevTouchY, x0, y0) < DOUBLE_TAP_RADIUS);
}

function uniqueRandomNumbers(numRandomNumbers, lowerLimit, upperLimit){
    var uniqueNumbers = [];
    while(uniqueNumbers.length != numRandomNumbers){
        var currentRandomNumber = randomNumbersInRange(lowerLimit, upperLimit);
        if(uniqueNumbers.indexOf(currentRandomNumber) === -1){
            uniqueNumbers.push(currentRandomNumber);
        }
    }

    return uniqueNumbers;
}

function randomNumbersInRange(lowerLimit, upperLimit){
    return Math.floor(Math.random() * (1 + upperLimit - lowerLimit)) + lowerLimit;
}

function createWallpaperPages(numWallpapers){
    var page = [];

    page.push(<View key='1'><Text>1</Text></View>);
    page.push(<View key='2'><Text>2</Text></View>);
    page.push(<View key='3'><Text>3</Text></View>);
    page.push(<View key='4'><Text>4</Text></View>);
    page.push(<View key='5'><Text>5</Text></View>);

    return page;
}

module.exports = {
    distance: distance,
    fetchWallsJson: fetchWallsJson,
    isDoubleTap: isDoubleTap,
    uniqueRandomNumbers: uniqueRandomNumbers,
    randomNumbersInRange: randomNumbersInRange,
    createWallpaperPages: createWallpaperPages,
    NUM_WALLPAPERS: NUM_WALLPAPERS
};