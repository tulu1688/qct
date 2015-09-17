var opts = { db: { native_parser: true }};
var mongoose = require('./index.js'),
	shuffle = require('knuth-shuffle').knuthShuffle,
	async = require('async');

var QuizSchema = new mongoose.Schema({
	quiz: String,
	explaination: String,
	options: [String],
	anwers: [Number],
	category: String,
	type: Number,
	extralink: String,
	updated_at: { type: Date, default: Date.now },
});

var Quiz = mongoose.model('Quiz', QuizSchema);

exports.create = function(obj,callback){
	var quiz = new Quiz(obj);
	quiz.save(callback);
}

exports.find = function(obj,callback){
	Quiz.find(obj,callback);
}

exports.findOne = function(obj,callback){
	Quiz.findOne(obj,callback);
}

exports.findRandom = function(obj,callback){
	var numberOfItems = obj.limit;
	var filter = new Object();
	if (obj.category != null)
		filter.category = obj.category;

	Quiz.find(filter, function(err, data) {
	    if (err) callback(err,null);

    	// shuffle array, as per here  https://github.com/coolaj86/knuth-shuffle
    	var arr = shuffle(data.slice(0));
    	// get only the first numberOfItems of the shuffled array
    	arr.splice(numberOfItems, arr.length - numberOfItems);
    	// new array to store all items
    	var return_arr = [];

	    // use async each, as per here http://justinklemm.com/node-js-async-tutorial/
	    async.each(arr, function(item, callback) {
	        // get items 1 by 1 and add to the return_arr
	        Quiz.findById(item._id, function(err, data) {
	            return_arr.push(data);
	            callback();
	        });
	    }, function(err) {
	        // callback(err,return_arr);
	        // FIXME convert it to BachTX format
	        var convertArr = [];
	        for (var i=0;i<return_arr.length;i++){
	        	var obj = return_arr[i];
	        	var isMultichoice = obj.anwers.length > 1;
	        	var options = [];
	        	var isAnswer = [];

	        	for (var j=0;j<obj.options.length;j++){
	        		options.push({
	        			Id: j,
	        			QuestionId: obj._id,
	        			Name: obj.options[j]
	        		});
	        	}

	        	convertArr.push({
	        		Id: obj._id,
	        		Name: obj.quiz,
	        		QuestionTypeId: (obj.type == null) ? 1 : obj.type,
	        		Link: obj.extralink,
	        		MultiChoice: isMultichoice,
	        		Options: options,
	        		IsAnswer: obj.anwers
	        	});
	        }
	        callback(err,convertArr);
	    });
	});
}

exports.findById = function(obj,callback){
	Quiz.findById(obj,callback);
}

exports.update = function(conditions,update,options,callback){
	Quiz.update(conditions,update,options,callback);
}

exports.findByIdAndUpdate = function(conditions,update,callback){
	Quiz.findByIdAndUpdate(conditions,update,callback);
}

exports.findOneAndUpdate = function(conditions,update,callback){
	Quiz.findOneAndUpdate(conditions,update,callback);
}

exports.remove = function(conditions,callback){
	Quiz.remove(conditions,callback);
}

exports.findByIdAndRemove = function(id,callback){
	Quiz.findByIdAndRemove(id,callback);
}

exports.findOneAndRemove = function(conditions,callback){
	Quiz.findOneAndRemove(conditions,callback);	
}

exports.create = function(obj,callback){
	Quiz.create(obj,callback);
}

exports.getCategories = function(callback){
	Quiz.collection.distinct("category",callback);
}

exports.dropDb = function(callback){
	Quiz.collection.drop();
}