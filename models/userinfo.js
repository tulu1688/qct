var opts = { db: { native_parser: true }};
var mongoose = require('./index.js');

// mongoose.connect('mongodb://localhost/userInfosc');

var UserInfoSchema = new mongoose.Schema({
	username: String,
	password: String,
	displayname: String,
	updated_at: { type: Date, default: Date.now }
});

var UserInfoTable = mongoose.model('UserInfo', UserInfoSchema);

exports.create = function(obj,callback){
	var userInfo = new UserInfoTable(obj);
	userInfo.save(callback);
}

exports.find = function(obj,callback){
	UserInfoTable.find(obj,callback);
}

exports.findById = function(obj,callback){
	UserInfoTable.findById(obj,callback);
}

exports.update = function(conditions,update,options,callback){
	UserInfoTable.update(conditions,update,options,callback);
}

exports.findByIdAndUpdate = function(conditions,update,callback){
	UserInfoTable.findByIdAndUpdate(conditions,update,callback);
}

exports.findOneAndUpdate = function(conditions,update,callback){
	UserInfoTable.findOneAndUpdate(conditions,update,callback);
}

exports.remove = function(conditions,callback){
	UserInfoTable.remove(conditions,callback);
}

exports.findByIdAndRemove = function(id,callback){
	UserInfoTable.findByIdAndRemove(id,callback);
}

exports.findOneAndRemove = function(conditions,callback){
	UserInfoTable.findOneAndRemove(conditions,callback);	
}

exports.create = function(obj,callback){
	UserInfoTable.create(obj,callback);
}