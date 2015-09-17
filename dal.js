var userInfo = require('./models/userinfo.js'),
	quiz = require('./models/quizs.js'),
	history = require('./models/historyinfo.js'),
	category = require('./models/category.js'),
	fs = require('fs'),
	async = require('async'),
	_ = require('underscore'),
	EasyZip = require('easy-zip').EasyZip,
	constValues = require('./const.js');

exports.login = function(command, params, client){
	userInfo.find({
      username: params.username,
      password: params.password
    },function(err, ui){
      if(err) {
        client.emit(command, {
          result: constValues.CODE_INTERNAL_ERROR // internal error
        });
      } else {
        if (ui != null) {
          if (ui.length == 0) {
            client.emit(command, {
              result: constValues.CODE_USER_NOTFOUND // not found
            });
          } else if (ui.length == 1) {
            client.emit(command, {
              result: constValues.CODE_SUCCESSFUL,
              userinfo: ui[0] // succesfull
            });            
          }
        } else {
          client.emit(command, {
            result: constValues.CODE_USER_NOTFOUND // not found
          });
        }
      }
    });
}

exports.register = function(command,params,client){
	userInfo.find({
      username: params.username,
      password: params.password
    },function(err, ui){
      if(err) {
        client.emit(command,{
        	result: constValues.CODE_INTERNAL_ERROR // internal error
        })
      } else {
        if (ui != null) {
          if (ui.length == 0) {
				userInfo.create(params,function(err,data){
					if (err) {
				        client.emit(command,{
		    				result: constValues.CODE_INTERNAL_ERROR
		    			})
					}

			        client.emit(command,{
						result: constValues.CODE_SUCCESSFUL,
						data: data
					});
				});
          } else if (ui.length == 1) {
	        client.emit(command,{
				result: constValues.CODE_USER_EXISTED
			});
          }
        } else {
			userInfo.create(params,function(err,data){
		        client.emit(command,{
    				result: constValues.CODE_INTERNAL_ERROR
    			});
			});
        }
      }
    });
}

exports.getCategories = function(command,client){
	category.find(null,function(err, data){
		if (err) {
	        client.emit(command,{
				result: constValues.CODE_INTERNAL_ERROR
			});
		}

	    client.emit(command,{
			result: constValues.CODE_SUCCESSFUL,
			data: data
		});
	});
}

exports.getQuizs = function(command,data,client){
	quiz.find(data,function(err,quizList){
		if (err) {
	        client.emit(command,{
				result: constValues.CODE_INTERNAL_ERROR
			});
		}

        client.emit(command,{
			result: constValues.CODE_SUCCESSFUL,
			data: quizList
		});
	});
}

exports.getRandomQuizs = function(command,data,client){
	quiz.findRandom(data,function(err,quizList){
		if (err) {
	        client.emit(command,{
				result: constValues.CODE_INTERNAL_ERROR
			});
		}

        client.emit(command,{
			result: constValues.CODE_SUCCESSFUL,
			data: quizList
		});
	});
}

exports.getExams = function(command,data,client){
	var arr = data.quiz_no;
	var return_arr = [];

    async.each(arr, function(item, callback) {
		quiz.findRandom({limit: item},function(err,quizList){
			return_arr.push(quizList);
			callback();
		});
    }, function(err) {
    	if (err)
	        client.emit(command,{
				result: constValues.CODE_INTERNAL_ERROR
			});

        client.emit(command,{
			result: constValues.CODE_SUCCESSFUL,
			data: return_arr
		});
    });
}

exports.getHistory = function(command,data,client){
	history.find(data,function(err,history){
		if (err) {
	        client.emit(command,{
				result: constValues.CODE_INTERNAL_ERROR
			});
		}

        client.emit(command,{
			result: constValues.CODE_SUCCESSFUL,
			data: history
		});
	});
}

exports.savePoint = function(command,params,client){
	history.upsearchId(params,function(err,data){
		if (err) {
	        client.emit(command,{
				result: constValues.CODE_INTERNAL_ERROR
			})
		}

        client.emit(command,{
			result: constValues.CODE_SUCCESSFUL,
			data: data
		});
	});
}

exports.createCategory = function(command,params,client){
	category.createCategory(params, function(err,data){
		if (err) {
	        client.emit(command,{
				result: constValues.CODE_INTERNAL_ERROR
			})
		}

		category.find(null,function(err, data){
			if (err) {
		        client.emit(command,{
					result: constValues.CODE_INTERNAL_ERROR
				});
			}

    	    client.emit(command,{
				result: constValues.CODE_SUCCESSFUL,
				data: data
			});
		});
	});
}

exports.createQuiz = function(command,params,client){
    quiz.create(params,function(err,data){
		if (err) {
	        client.emit(command,{
				result: constValues.CODE_INTERNAL_ERROR
			})
		}

	    client.emit(command,{
			result: constValues.CODE_SUCCESSFUL,
			data: data
		});
    });
}

exports.updateQuiz = function(command,params,client){
	quiz.findByIdAndUpdate(params._id,params,function(err,data){
		if (err) {
	        client.emit(command,{
				result: constValues.CODE_INTERNAL_ERROR
			});
		}

	    client.emit(command,{
			result: constValues.CODE_SUCCESSFUL,
			data: data
		});
	});
};

exports.download = function(params,response){
	console.log(params);
	quiz.find(params,function(err,quizlist){
		if (err) {
			console.error(err);
		}

		var zip = new EasyZip();
		zip.file('question.json',JSON.stringify(quizlist));
		zip.writeToFile('./public/uploads/' + params.category + '.qiz');

		var file = fs.readFileSync(__dirname + '/public/uploads/' + params.category + '.qiz', 'binary');
		response.setHeader('Content-Length', file.length);
		response.write(file, 'binary');
		response.end();
	});
}