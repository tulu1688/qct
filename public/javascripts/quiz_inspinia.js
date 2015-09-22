var tmpfilename = '';
var uploadFileForm;
var category = '';
var oTable;
var tmpObj = new Object();
var objList = [];
var base64data = [];

var url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
var socket = io.connect(url, {
    'reconnect': true,
    'connect timeout': 2500,
    'reconnection delay': 500,
    'origins': '*:*'
});

socket.on('connect', function() {
    var category = $('.category_id').html();

});

socket.on('create_quiz', function(data) {
    objList.push(data.data);
    oTable.row.add([data.data.quiz, data.data.explaination, data.data]).draw(false);
});

socket.on('update_quiz', function(data) {
    for (var i = 0; i < objList.length; i++) {
        if (objList[i]._id == tmpObj._id) {
            objList[i] = tmpObj;
        }
    }
    location.reload();
});

function sendCommand(command, data) {
    socket.emit(command, data);
}

$(document).ready(function() {
    $('#question').summernote({
        styleWithSpan: false,
        toolbar: [
            ['font', ['bold', 'italic', 'underline', 'clear']]
        ],
        lang: 'vi-VN'
    });
    $('#subquestion').summernote({
        styleWithSpan: false,
        toolbar: [
            ['font', ['bold', 'italic', 'underline', 'clear']]
        ],
        lang: 'vi-VN'
    });
    $('#explaination').summernote({
        styleWithSpan: false,
        toolbar: [
            ['font', ['bold', 'italic', 'underline', 'clear']]
        ],
        lang: 'vi-VN'
    });

    uploadFileForm = $("#cvfile").uploadFile({
        url: "/uploadfile",
        fileName: "file",
        onShowDown: function(fileName) {
            setTimeout(function() {
                var responses = uploadFileForm.getResponses();
                if (responses.length == 0)
                    return;
                tmpfilename = responses[responses.length - 1];

                // Extra data
                $('#imgfile').val(tmpfilename);
                uploadFileForm.clearAll();
            }, 300);
        }
    });
});

function clearEditQuizZone() {
    $('#submit_quiz').html('Tạo mới');
    $('#question').code('');
    $('#explaination').code('');
    $("#quiz_id").html('');
    $('#imgfile').val('');

    for (var i = 1; i <= 6; i++) {
        $('#opt' + i).val('');
        $('#chb' + i).prop('checked', false);
    }
    tmpfilename = '';
}