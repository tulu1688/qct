var current_examname = '';
var current_question = 0;
var question_number = 0;
var tmpfilename = '';
var uploadFileForm;

var url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
var socket = io.connect(url, {
    'reconnect': true,
    'connect timeout': 2500,
    'reconnection delay': 500
});

function sendCommand(command, data){
	socket.emit(command, data);
}

$(document).ready(function() {
    $.material.init();
    $('#summernote').summernote({
        	styleWithSpan: false,
        	toolbar: [
			    ['font', ['bold', 'italic', 'underline', 'clear']],
			    ['view', ['codeview']],
            ],
            lang: 'vi-VN'
    });
	$("#summernote").code("<h5>Tác giả:</h5><h5>Số câu hỏi:</h5><h5>Thời gian làm bài:</h5>");
	sendCommand('get_categories',null);
});

// Create category
function summitCategory(){
	var categoryName = $('.categoryname').val();
	var detailInfo = $('#summernote').code();

	if (categoryName.length == 0) {
		alert("select category name");
	} else {
		sendCommand('create_category', {
			name: categoryName,
			info: detailInfo
		});
	}
}

// Update category
socket.on('create_category',function(data){
	displayCategories(data.data);
});

socket.on('get_categories',function(data){
	displayCategories(data.data);
});

function displayCategories(data){
	$('#categories').html('');
	var htmlStr = '';
	for (var i=0; i<data.length;i++){
		htmlStr += '<div class="col-lg-9"><h4>' + data[i].name + '</h4></div>' +
					'<div class="col-lg-3"><button type="button" onclick="parent.location=&quot;/category/' + data[i]._id + '&quot;" style="width: 160px;" class="btn btn-material-light-green btn-primary">Mở gói câu hỏi</button></div>';
	}
	$('#categories').html(htmlStr);
}
