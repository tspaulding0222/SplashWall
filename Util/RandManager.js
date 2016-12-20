module.exports = {
    uniqueRandomNumbers: uniqueRandomNumbers,
    randomNumbersInRange: randomNumbersInRange
};

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