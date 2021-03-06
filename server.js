const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', log + '\n', (error) => {
        if (error) {
            console.log('Unable to append to server.log.');
        }
    });
    console.log(log);
    next();
});

app.use((req, res, next) => {
    var keysString = fs.readFileSync('settings.json');
    var mode = JSON.parse(keysString).filter((k) => k.key === "mode")[0].value;
    if (mode === "maintenance") {
        res.render('maintenance.hbs');
    } else {
        next();
    }
});

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');
    // res.send({
    //     name: 'Pranay',
    //     likes: [
    //         'Biking',
    //         'Cities'
    //     ]
    // });
    res.render('home.hbs',{
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs',{
        pageTitle: 'About Page'
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs',{
        pageTitle: 'Project Page',
        message: 'Protfolio page here'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Error handling request.'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});