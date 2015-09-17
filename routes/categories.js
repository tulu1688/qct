var express = require('express'),
	categories = require('../models/category.js'),
	router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('CategoryRoute --> Time: ', Date.now());
  next();
});

router.get('/', function(req, res, next) {
	categories.find({completed:false},function(err,data){
	  if (err) {
	    res.send(err);
	  } else {
	    res.json(data);
      // Todo get list of category
      // res.render('test.jade',{title: data.name});
	  }
	});
});

router.get('/:id', function (req, res, next) {
  categories.findById(req.params.id, function(err, category){
    if(err) res.send(err);
    res.render('quiz.ejs',{
      title: category.name,
      _id: category._id
    });
  });
});

router.post('/', function (req, res, next) {
  categories.create(req.body, function(err, post){
    if(err) next(err);
    res.json(post);
  });
});

router.put('/:id', function (req, res, next) {
  categories.findByIdAndUpdate(req.params.id, req.body, function(err, post){
    if(err) next(err);
    res.json(post);
  });
});

router.delete('/:id',function(req,res,next){
  categories.findByIdAndRemove(req.params.id, function(err,data){
    if(err) next(err);
    res.json(data);
  });
});

module.exports = router;