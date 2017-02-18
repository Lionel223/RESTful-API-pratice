// from
// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var morgan = require('morgan');

// configure app
//app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var mongoose = require('mongoose');

// http://mongoosejs.com/docs/promises.html
// http://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise
// must add this line, or it will have something wrong
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bear');
var Bear = require('./app/models/bear');

// ROUTES FOR API
// =============================================================================

var router = express.Router();

// middleware for all requests
// We can throw errors here in case something is wrong
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

    // create a bear
    .post(function(req, res) {
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)
        bear.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Bear created!' });
        });
    })

    // get all the bears
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });


router.route('/bears/:bear_id')
    // get the bear
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    // update the bear
    .put(function(req, res) {
        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            bear.name = req.body.name;  // update the bears info
            bear.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Bear updated!' });
            });
        });
    })

    // delete the bear
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);