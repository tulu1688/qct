var opts = { db: { native_parser: true }};
var mongoose = require('./index.js');

var HistorySchema = new mongoose.Schema({
	username: String,
	id: String,
	status: String,
	point: String,
	time: String,
	name: String,
	updated_at: { type: Date, default: Date.now },
});

var HistoryTable = mongoose.model('HistoryTable', HistorySchema);

exports.create = function(obj,callback){
	var history = new HistoryTable(obj);
	history.save(callback);
}

exports.find = function(obj,callback){
	HistoryTable.find(obj,callback);
}

exports.findById = function(obj,callback){
	HistoryTable.findById(obj,callback);
}

exports.update = function(conditions,update,options,callback){
	HistoryTable.update(conditions,update,options,callback);
}

exports.findByIdAndUpdate = function(conditions,update,callback){
	HistoryTable.findByIdAndUpdate(conditions,update,callback);
}

exports.findOneAndUpdate = function(conditions,update,callback){
	HistoryTable.findOneAndUpdate(conditions,update,callback);
}

exports.upsearchId = function(update,callback) {
	HistoryTable.findOne({
			id: update.id
		},function(err,data){
			if (err)
				callback(err,null);

			if (data != null) {
				HistoryTable.findOneAndUpdate({
					id: update.id
				},update,function(err,data){
					if (err)
						callback(err,null);

					var ret = update;
					ret._id = data._id;
					ret.updated_at = data.updated_at;
					ret.__v = data.__v;
					callback(null, ret);
				});
			} else {
				HistoryTable.create(update,callback);
			}
		});
}

exports.remove = function(conditions,callback){
	HistoryTable.remove(conditions,callback);
}

exports.findByIdAndRemove = function(id,callback){
	HistoryTable.findByIdAndRemove(id,callback);
}

exports.findOneAndRemove = function(conditions,callback){
	HistoryTable.findOneAndRemove(conditions,callback);	
}

exports.create = function(obj,callback){
	HistoryTable.create(obj,callback);
}

exports.dropDb = function(callback){
	HistoryTable.collection.drop();
}