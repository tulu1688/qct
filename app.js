/**
 * 4G quiz app
 * Author: KhaiTN
 * Date: 12/09/2015
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    multipart = require('connect-multiparty');
router = require('./routes'),
    io = require('socket.io'),
    dal = require('./dal.js'),
    util = require('util'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    lwip = require('lwip'),
    constValues = require('./const.js');;

var app = express();

// Configuration
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client IP:', ip);
    next();
});

// Routes
app.use('/', router.root);
app.use('/category/', router.categories);
app.use('/quizs/', router.quizs);

app.post('/uploadfile', multipart(), function(req, res) {
    var file = req.files.file;
    var newFilePath = './public/uploads/' + file.originalFilename;

    moveFile(file.path, newFilePath, function() {
        lwip.open(newFilePath, function(err, image) {
            var width = image.width();
            var height = image.height();

            if (width > 500) {
                height = ~~((height * 500) / width);
                width = 500;
            } else if (height > 1000) {
                width = ~~((width * 1000) / height);
                height = 1000;
            }

            image.batch().cover(width, height, "moving-average").writeFile(newFilePath, function(err) {});
        });
    });

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end('/uploads/' + file.originalFilename, "utf-8");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('404.jade', {
        message: err.message,
        error: {}
    });
});

// Run server
var server = http.createServer(app);
server.listen(3001, function() {
    console.log("Express server listening on port %d in %s mode", server.address().port, server.address().address);
});

var socket = io.listen(server, {
    log: false
});

socket.sockets.on('connection', function(client) {

    // Login task
    client.on('user_authenticate', function(data) {
        dal.login('user_authenticate', data, client);
    });

    // Register task
    client.on('user_register', function(data) {
        dal.register('user_register', data, client);
    });

    // Get categories
    client.on('get_categories', function() {
        dal.getCategories('get_categories', client);
    });

    // Get quizs from category
    client.on('get_quizs', function(data) {
        dal.getQuizs('get_quizs', data, client);
    });

    // Get quizs from category
    client.on('get_ramdom_quizs', function(data) {
        dal.getRandomQuizs('get_ramdom_quizs', data, client);
    });

    // Save point
    client.on('save_point', function(data) {
        dal.savePoint('save_point', data, client);
    });

    // get history
    client.on('get_history', function(data) {
        dal.getHistory('get_history', data, client);
    });

    // get exams
    client.on('get_exams', function() {
        dal.getExams('get_exams', {
            quiz_no: [15, 20, 30, 30, 60, 100]
        }, client);
    });

    //////////////////////////////////////////////////
    // Quiz creator functions
    //////////////////////////////////////////////////
    // Create category
    client.on('create_category', function(data) {
        dal.createCategory('create_category', data, client);
    });

    // Create quiz
    client.on('create_quiz', function(data) {
        dal.createQuiz('create_quiz', data, client);
    });

    // Update quiz
    client.on('update_quiz', function(data) {
        dal.updateQuiz('update_quiz', data, client);
    });
});

// Utils
function moveFile(srcfile, desfile, callback) {
    var is = fs.createReadStream(srcfile)
    var os = fs.createWriteStream(desfile);

    util.pump(is, os, function() {
        try {
            fs.unlinkSync(srcfile);
            callback();
        } catch (e) {
            console.log(e);
        }
    });
}

exports = module.exports = app;
