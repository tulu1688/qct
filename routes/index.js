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

router.get('/download/:id', function(req, res, next) {
	dal.downloadExam({category: req.params.id},res);
});

router.get('/quiz/:id', function(req, res, next) {
	// Category
	var category_id = req.params.id;
	res.render('quiz_inspinia.ejs');
});

router.get('/category_inspinia',function(req,res,next){
	res.render('category_inspinia.ejs', {title: 'TuluKhai', id: '55f62113a04412f842e7c5e0'});
});

exports.categories = categories;
exports.quizs = quizs;
exports.root = router;