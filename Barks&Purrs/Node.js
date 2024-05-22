// Import modules
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const session = require('express-session');

// Create instance of the Express application
const app = express();

// Set view engine to EJS to render files in 'views' folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

const arrayAvailablePets = [
    { name: 'Nyla', type: 'Cat', breed: 'Russian Blue', age: '2', gender: 'Female', compatibility: 'Young Children', extra: 'Studying to become a purr-fessional therapist', image: '/images/nyla.jpg' },
    { name: 'Ollie', type: 'Cat', breed: 'Tuxedo', age: '1', gender: 'Female', compatibility: 'Other Cats,Young Children', extra: 'Always looks her best', image: '/images/ollie.JPG' },
    { name: 'Ginger', type: 'Cat', breed: 'Ginger', age: '13', gender: 'Female', compatibility: 'Other Cats,Young Children', extra: ' Brings home other animals allegedly', image: '/images/ginger.JPG' },
    { name: 'Luna', type: 'Cat', breed: 'American ShortEars', age: '9', gender: 'Female', compatibility: 'Young Children', extra: 'Also known as The Kitty Who Lived, attends Meow-gwarts School of Whisker-craft and Paw-zardry', image: '/images/luna.jpg' },
    { name: 'Jasmine', type: 'Cat', breed: 'Tabbie', age: '3', gender: 'Female', compatibility: 'Other Cats,Young Children', extra: 'Permanently ashamed', image: '/images/ashamed_jasmine.JPG' },
    { name: 'Billie', type: 'Cat', breed: 'Tabbie', age: '6', gender: 'Male', compatibility: 'Other Dogs,Other Cats,Young Children', extra: ' Purr-fessional Rizzologist, affectionate, will casually steal your girl', image: '/images/billy.jpg' },
    { name: 'JJ', type: 'Cat', breed: 'Tabbie', age: '4', gender: 'Male', compatibility: 'Other Dogs,Other Cats,Young Children', extra: ' Has a strange addiction to Pikachu, our newest member of our family', image: '/images/jj.jpg' },
    { name: 'Oscar', type: 'Dog', breed: 'French Bulldog', age: '7', gender: 'Male', compatibility: 'Other Dogs,Young Children', extra: 'Attention, naps and food', image: '/images/oscar.jpg' },
    { name: 'Romeo', type: 'Dog', breed: 'Portuguese Water Dog', age: '3', gender: 'Male', compatibility: 'Other Dogs,Other Cats,Young Children', extra: 'Who is this dog and why is it in my camera roll', image: '/images/romeo.jpg' }
]

// ------------------ JavaScript Functions ------------------
function filterAnimals(animalType, breed, age, gender, compatibility) {
    const arrayOfPetsCopy = [...arrayAvailablePets];

    return arrayOfPetsCopy.filter(animal => {
        let matches = true;
        if (animalType && animal.type !== animalType) matches = false;
        if (breed != 'doesnotmatter') {
            if (breed && animal.breed !== breed) matches = false;
        }
        if (age != 'doesnotmatter') {
            if (animal.age < age.charAt(0) || animal.age > age.charAt(2)) matches = false;
        }

        if (gender != 'doesnotmatter') {
            if (gender && animal.gender !== gender) matches = false;
        }
        if (compatibility != 'doesnotmatter') {
            if (compatibility.toString() && animal.compatibility !== compatibility.toString()) matches = false;
        }
        return matches;
    });
}

function checkUsername(username, callback) {
    fs.readFile('./txt_files/login_info.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file: ', err);
            callback(err, null);
            return;
        }
        const lines = data.split('\n');

        for (let line of lines) {
            const information = line.split(':');

            if (information[0] === username) {
                callback(err, true);
                return;
            }
        }
        callback(null, false);

    });
}

function checkLoginCredentials(username, password, callback) {
    fs.readFile('./txt_files/login_info.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file: ', err);
            callback(err, false);
            return;
        }
        const lines = data.split('\n');
        let isLoggedIn = false;

        for (let line of lines) {
            const information = line.split(':');
            if (information[0] === username && information[1] === password) {
                isLoggedIn = true;
                break;
            }
        }
        callback(null, isLoggedIn);
    });
}

// ------------------ Routes to handle HTML files GET------------------
app.get('/', (req, res) => {
    res.render('homepage', { authenticated: req.session.authenticated });
})

app.get('/pets', (req, res) => {
    res.render('pets', { authenticated: req.session.authenticated });
})

app.get('/findpet', (req, res) => {
    res.render('findpet', { authenticated: req.session.authenticated });
})

app.get('/dogcare', (req, res) => {
    res.render('dogcare', { authenticated: req.session.authenticated });
})

app.get('/catcare', (req, res) => {
    res.render('catcare', { authenticated: req.session.authenticated });
})

app.get('/giveaway', (req, res) => {
    // Check if the user is authenticated
    if (req.session.authenticated) {
        res.render('giveaway', { authenticated: req.session.authenticated }); // Render the page
    } else {
        res.render('loginPage', {message: "", authenticated: req.session.authenticated }); // Redirect to the sign-in page if not authenticated
    }
})

app.get('/createaccount', (req, res) => {
    res.render('createAccount', {message: "", authenticated: req.session.authenticated })
})

app.get('/contactpage', (req, res) => {
    res.render('contactpage', { authenticated: req.session.authenticated });
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out.');
            return;
        }
        res.redirect('/'); // Redirect to the login page or any other desired page
    });
})

// ------------------ Routes to handle HTML files POST ------------------
app.post('/findpet/submit', (req, res) => {
    const formData = req.body;
    const filteredAnimals = filterAnimals(formData.animalTypeFind, formData.breed, formData.age, formData.genderFind, formData.compatibleFind);

    res.render('pets', { pets: filteredAnimals, authenticated: req.session.authenticated });
})

app.post('/createAccount', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    checkUsername(username, (err, result) => {
        if (err) {
            console.error('Error checking username:', err);
            res.status(500).send('Error creating account.');
            return;
        }

        if (result) {
            // Username already exists
            res.status(400).render('createAccount',{message: 'That username already exists. Try again.', authenticated: req.session.authenticated });
        } else {
            // Username is available, proceed with creating the account
            console.log('Username is available.');
            let data = `${username}:${password}\n`;
            fs.appendFile('./txt_files/login_info.txt', data, (err) => {
                if (err) {
                    console.error('Error writing to file:', err);
                    res.status(500).send('Error creating account. Please try again.');
                } else {
                    res.status(200).render('createAccount', {message: 'Account Created Successfully!', authenticated: req.session.authenticated });
                }
            });
        }
    });
})

app.post('/login', (req, res) => {
    // Check if credentials are correct (replace this with your authentication logic)
    let username = req.body.usernameLogin;
    let password = req.body.passwordLogin;
    
    checkLoginCredentials(username, password, (err, isLoggedIn) => {
        if (err){
            console.error('Error loggng in:', err);
            res.status(500).send('Error logging in.');
            return;
        }
        if (isLoggedIn){
            req.session.authenticated = true;
            res.redirect('/giveaway'); // Redirect to the Give a Pet Away page
        } else {
            res.status(500).render('loginPage', {message:'*Incorrect username or password. Please try again.', authenticated: req.session.authenticated});
        }
    });
});

app.listen(3000, () => {
    console.log("HE SAID I'VE BEEN TO THE PORT 3000");
})