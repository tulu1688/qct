var userInfo = require('./models/userinfo.js'),
	quiz = require('./models/quizs.js'),
	history = require('./models/historyinfo.js'),
  async = require('async'),
	category = require('./models/category.js');

function create(params){
	userInfo.find({
      username: params.username,
      password: params.password
    },function(err, ui){
      if(err) {
        console.log('internal error');
      } else {
        if (ui != null) {
          if (ui.length == 0) {
				userInfo.create(params,function(err,data){
					if (err) {
						console.log(err);
					}

					console.log(data);
				});
          } else if (ui.length == 1) {
            console.log('user existed');
          }
        } else {
			userInfo.create(params,function(err,data){
				if (err) {
					console.log(err);
				}

				console.log(data);
			});
        }
      }
    });
}

function findUserInfo(params){
	userInfo.find({
      username: params.username,
      password: params.password
    },function(err, ui){
      if(err) {
        console.log('internal error');
      } else {
        if (ui != null) {
          if (ui.length == 0) {
            console.log('user not found');
          } else if (ui.length == 1) {
            console.log('succesfull', ui[0]);
          }
        } else {
          console.log('user not found');
        }
      }
    });
}

function createQuiz(params){
	quiz.create(params,function(err,data){
		if (err)
			console.log("Error", err);
		console.log(data);
	});
}

function getExams(params){
  var arr = params.quiz_no;
  var return_arr = [];
  console.log(arr);

  async.each(arr, function(item, callback) {
    console.log(item);
    quiz.findRandom({limit: item},function(err,quizList){
      return_arr.push(quizList);
      callback();
    });
  }, function(err) {
    if (err)
      console.log(err);

    console.log(return_arr);
  });
}

// createQuiz({
// 	quiz: 'Vung len hoi cac no le o the gian 8',
// 	explaination: 'Vung len hoi ai cuc kho ban han',
// 	type: 1,
// 	options: ['Suc soi nhiet huyet trong tam day chua roi','Ket doan lai de ngay mai', 'Nanh tec na song na lo','Se la xa hoi tuong lai'],
// 	anwers: [1,2],
// 	category: 'cau hoi 3G',
// });

// findUserInfo({
// 	username: '121089',
// 	password: '123456'
// });

// create({
// 	username: '121089',
// 	password: '123456'
// });

// quiz.getCategories(function(err, data){
// 	console.log(data);
// });

// quiz.getCategories2(function(err,data){
// 	console.log(err,data);
// });

// quiz.findRandom({
// 		limit: 5
// 	},function(err,data){
// 	if (err) {
// 		console.log('Loi');
// 	}
//     console.log(data);
// });

// quiz.findOne({
// 	category: 'cau hoi 5G'
// }, function(err,data){
// 	console.log(err,data);
// });

// quiz.dropDb();

// history.create({
//     username: '121088',
//     id: 'xxx',
//     status: 'PASSED',
//     point: '3/10',
//     time: '00:45',
// 	},function(err,data){
// 		if (err)
// 			console.log(err);
// 		console.log(data);
// });

// history.find({username: '121088'},function(err,history){
// 	if (err) {
// 		console.log('error');
// 	}
//   console.log(history);
// });

// history.upsearchId({
//     username: '121088',
//     id: 'xxfx',
//     status: 'Fail',
//     point: '9/10',
//     time: '07:45',
// }, function(err,data){
//   console.log(err,data);
// });

// history.dropDb();

///////////////////////////////////////////////////
// Category
// category.createCategory({name: "tulu"},function(err,data){
// 	console.log(err,data);
// });

// category.dropDb();

// getExams({quiz_no: [10,1,2]});