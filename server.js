var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quotingDojo');

var UserSchema = new mongoose.Schema({
    name: String,
    quote: String
})
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var userQuote = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({ extended: true }));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
    });

app.get('/quotes', function(req, res) {
    userQuote.find({}, function(err, quotes) {
        if (err) {console.log(err);}
        context = {
            quotes:quotes
        }
        res.render('quotes', context);
    })
})
app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new userQuote({
        name: req.body.name, 
        quote: req.body.quote
    });

    quote.save(function(err) {
      if(err) {
        console.log('something went wrong');
        res.redirect('/')
      } else { 
        console.log('successfully added a quote!');
        res.redirect('/quotes');
      }
    })
})
app.listen(8000, function() {
    console.log("listening on port 8000");
})