var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = 8888;
var uri = "mongodb://CoolAndNewUser:weakpassword@45325.mlab.com:45325/coolandnewcollection";
var jokes=[{setup:"Our wedding was so beautiful,",punchline:"even the cake was in tiers", votes: 0},{setup:"I'm reading a book on the history of glue",punchline:"I just can't seem to put it down", votes: 0},{setup:"What do you call an Argentinian with a rubber toe?",punchline:"Roberto", votes: 0}];
app.use(bodyParser.json());
app.listen(process.env.PORT || port, function(){
    console.log("Listening on " + port);
});

app.use(express.static('static'));

app.get('/admin', function(req, res) {
	
	console.log('Attempting to add into database.');
	mongodb.connect(uri, function(err, db) {
		var collection = db.collection('jokes');
		collection.insertMany(jokes,
			function(err, results){
				res.send(results);
				db.close();
		);	}
	});
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/static/index.html');
});

app.get('/jokes', function(req, res) {

    var randomNumber = Math.floor(Math.random() * jokes.length);
    jokes[randomNumber].id = randomNumber;

    res.send(jokes[randomNumber]);
});

app.get('/jokes', function(req,res) {
	
	mongodb.connect(uri, function(err, db) {
		var collection = db.collection('jokes');
		collection.count(function(err, count) {
			var randomNumber = Math.floor(Math.random() * count);
			console.log(count + " jokes found in database. ");
			
			collection.find().limit(-1).skip(randomNumber).next(
				function(err, results) {
					res.send(results);
				}
		});
	});
});

app.post('/upvote', function(req, res) {
    console.log("Someone tried to upvote something");
    console.log(req.body);
    var jokeIndex = req.body.id;
    if (typeof jokes[jokeIndex].votes === 'undefined') {
        console.log("Creating vote for this joke");
        jokes[jokeIndex].votes = 0;
    }

    jokes[jokeIndex].votes++;

    res.send(jokes[jokeIndex]);
});

app.post('/downvote', function(req, res) {
    console.log("Someone tried to downvote something.");
    console.log(req.body);
    var jokeIndex = req.body.id;
    if (typeof jokes[jokeIndex].votes === 'undefined') {
        console.log("Creating vote for this joke");
        jokes[jokeIndex].votes = 0;
    }

    jokes[jokeIndex].votes--;

    res.send(jokes[jokeIndex]);
});