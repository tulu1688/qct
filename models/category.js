var opts = { db: { native_parser: true }};
var mongoose = require('./index.js');

var CategorySchema = new mongoose.Schema({
	name: String,
	info: String,
	updated_at: { type: Date, default: Date.now },
});

var CategoryTable = mongoose.model('Category', CategorySchema);

exports.createCategory = function(obj,callback) {
	var category = new CategoryTable(obj);

	CategoryTable.findOne({
		name: obj.name
	},function(err, data){
		if (err) {
			console.log('Create category error');
		} else if (data == null){
			category.save(callback);
		} else {
			callback(err,data);
		}
	});
}

exports.find = function(obj,callback){
	CategoryTable.find(obj,callback);
}

exports.findOne = function(obj,callback){
	CategoryTable.findOne(obj,callback);
}

exports.findById = function(obj,callback){
	CategoryTable.findById(obj,callback);
}

exports.update = function(conditions,update,options,callback){
	CategoryTable.update(conditions,update,options,callback);
}

exports.findByIdAndUpdate = function(conditions,update,callback){
	CategoryTable.findByIdAndUpdate(conditions,update,callback);
}

exports.findOneAndUpdate = function(conditions,update,callback){
	CategoryTable.findOneAndUpdate(conditions,update,callback);
}

exports.remove = function(conditions,callback){
	CategoryTable.remove(conditions,callback);
}

exports.findByIdAndRemove = function(id,callback){
	CategoryTable.findByIdAndRemove(id,callback);
}

exports.findOneAndRemove = function(conditions,callback){
	CategoryTable.findOneAndRemove(conditions,callback);	
}

exports.create = function(obj,callback){
	CategoryTable.create(obj,callback);
}

exports.dropDb = function(callback){
	CategoryTable.collection.drop();
}