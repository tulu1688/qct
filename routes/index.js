var express = require('express'),
	quizs = require('./quizs.js'),
	categories = require('./categories.js'),
	router = express.Router(),
	dal = require('../dal.js');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', function(req, res, next) {
	res.render('main.ejs');
});

router.get('/download/:id', function(req,res,next){
	dal.download({
		category: req.params.id
	}, res);
});

exports.categories = categories;
exports.quizs = quizs;
exports.root = router;