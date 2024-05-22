const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

function findSummation(N) {
    let sum = 0;
    while (N > 0) {
        sum += N;
        N--;
    }
    return sum;
}

function uppercaseFirstandLast(str) {
    const words = str.split(/\s+/);

    words.forEach((word, index) => {
        if (word.length == 1) {
            words[index] = word.toUpperCase();
        } else {
            words[index] = word.charAt(0).toUpperCase() + word.substring(1, word.length - 1) + word.charAt(word.length - 1).toUpperCase();
        }
    });

    const result = words.join(' ');
    return result;
}

function findAverageAndMedian(arrayNum) {
    let sum = 0;

    arrayNum.forEach((element, index) => {
        sum += parseFloat(element);
        arrayNum[index] = parseFloat(element);
    })
    let average = sum / arrayNum.length;

    const sortedArray = arrayNum.sort((a, b) => a - b);
    
    let median;
    const middleIndex = Math.floor(arrayNum.length / 2);

    if (arrayNum.length % 2 == 0) {
        median = (sortedArray[middleIndex - 1] + sortedArray[middleIndex]) / 2;
    } else {
        median = sortedArray[middleIndex];
    }

    return { average, median };
}

function find4Digits(arrayStr) {
    const pattern = /^[1-9]\d{3}$/
    console.log(arrayStr);

    for (let element of arrayStr) {
        if (pattern.test(element)) {
            console.log('we in');
            return element
        }
    }
    return false;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'exercises.html'));
})

app.post('/findSummation', (req, res) => {
    let input = req.body.findSummation;
    const pattern = /^[1-9]\d*$/;

    if (pattern.test(input)) {
        res.send('The result is: ' + findSummation(parseInt(input)));
    } else {
        res.send('The result is: ' + false);
    }

});

app.post('/uppercaseString', (req, res) => {
    let input = req.body.uppercaseString;

    if (input.trim().length === 0) {
        res.send('You did not enter anything.');
    } else {
        res.send('Received string: ' + input + '<br>Resulting string: ' + uppercaseFirstandLast(input));
    }

});

app.post('/averageAndMedian', (req, res) => {
    let input = req.body.averageAndMedian;
    let arrayNum = input.split(/\s+/);

    arrayNum = arrayNum.filter(element => element.trim() !== '');
    const pattern = /^\d+(\.\d+)?$/;
    

    for (let element of arrayNum) {
        if (!pattern.test(element)) {
            res.send('Invalid input.');
        }
    }

    if (!res.headersSent) {
        const result = findAverageAndMedian(arrayNum);
        res.send('Here is the average: ' + result.average + '<br>' + 'Here is the median: '
            + result.median + '<br>' + 'Here is the array: ' + arrayNum.join(', '));
    }

});

app.post('/find4Digits', (req, res) => {
    let input = req.body.find4Digits;
    let arrayStr = input.split(' ');

    res.send(find4Digits(arrayStr).toString());
})

app.post('/numberOfVisits', (req, res) => {
    let numVisits;

    if (!req.cookies.numVisits) {
        numVisits = 0;
    } else {
        numVisits = parseInt(req.cookies.numVisits)
    }
    numVisits++;

    res.cookie('numVisits', numVisits);

    const dateObj = new Date();
    const weekday = dateObj.toLocaleString('en-US', { weekday: 'short' });
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const date = dateObj.getDate();
    const hours = dateObj.toLocaleString('en-US', { hour: '2-digit', hour12: false });
    const minutes = dateObj.toLocaleString('en-US', { minute: '2-digit' });
    const seconds = dateObj.toLocaleString('en-US', { second: '2-digit' });
    const timeZone = dateObj.toLocaleString('en-US', { timeZoneName: 'short' });
    const year = dateObj.getFullYear();

    const formattedDate = `${weekday} ${month} ${date} ${hours}:${minutes}:${seconds} ${timeZone} ${year}`;
    res.cookie('previousTimeVisited', formattedDate);

    if (numVisits == 1) {
        res.send('Welcome to my webpage! It is your first time that you are here');
    } else {
        const previousTimeVisited = req.cookies.previousTimeVisited;
        console.log(previousTimeVisited);
        res.send(`Hello, this is the ${numVisits} time that you are visiting my webpage <br> The last time you visited my webpage was on: ${previousTimeVisited}`);
    }

})

app.post('/validatePhoneNumber', (req, res) => {
    let nameInput = req.body.name;
    let numberInput = req.body.phoneNumber;
    console.log(numberInput);
    const pattern = /^\d{3}-\d{3}-\d{4}$/

    if(pattern.test(numberInput)){
        res.send(`Name: ${nameInput}` + '<br>' + `Phone Number: ${numberInput}` +'<br><em>Phone number recorded successfully</em>');
    }else{
        res.send(`Error. Invalid phone number: ${numberInput}` + '<br><em>Phone number recorded unsuccessfully');
    }
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
});