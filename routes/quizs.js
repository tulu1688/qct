var express = require('express'),
	quizs = require('../models/quizs.js'),
	router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('QuizRoute --> Time: ', Date.now());
  next();
});

router.get('/', function(req, res, next) {
	quizs.find({completed:false},function(err,data){
	  if (err) {
	    res.send(err);
	  } else {
	    res.json(data);
	  }
	});
});

router.get('/:id', function (req, res, next) {
  quizs.findById(req.params.id, function(err, quiz){
    if(err) res.send(err);
    res.json(quiz);
  });
});

router.post('/', function (req, res, next) {
  quizs.create(req.body, function(err, post){
    if(err) next(err);
    res.json(post);
  });
});

router.put('/:id', function (req, res, next) {
  quizs.findByIdAndUpdate(req.params.id, req.body, function(err, post){
    if(err) next(err);
    res.json(post);
  });
});

router.delete('/:id',function(req,res,next){
  quizs.findByIdAndRemove(req.params.id, function(err,data){
    if(err) next(err);
    res.json(data);
  });
});

module.exports = router;