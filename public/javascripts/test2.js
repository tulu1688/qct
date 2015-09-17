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

socket.on('connect',function(){
    var category = $('.category_id').html();

    socket.emit('get_quizs', {
        category: category
    });
});

socket.on('get_quizs', function(data){
    var convertArr = [];
    objList = data.data;
    bindDataTable(objList);
});

socket.on('create_quiz',function(data){
    objList.push(data.data);
    oTable.row.add([data.data.quiz, data.data.explaination, data.data]).draw( false );
});

socket.on('update_quiz',function(data){
    for (var i=0;i<objList.length;i++){
        if (objList[i]._id == tmpObj._id) {
            objList[i] = tmpObj;
        }
    }
    location.reload();
});

function summit_answer(){
    var question = $('#question').code();
    var explaination = $('#explaination').code();
    var answers = [];
    var correct_answer = [];
    var _id = $("#quiz_id").html();
    var link = $('#imgfile').val();

    // Check question info content
    if (question.length == 0) {
        alert('Please specify question content');
    }
    // Check answers fill
    for (var i=0;i<6;i++){
        var val = $('#opt' + (i+1)).val();
        if (val.length == 0) {
            break;
        }

        if ($('#chb' + (i+1)).is(':checked')){
            correct_answer.push(i);
        }
        answers.push(val);
    }

    if (_id.length > 0) {
        tmpObj = {
            _id: _id,
            quiz: question,
            explaination: explaination,
            options: answers,
            anwers: correct_answer,
            extralink: link,
            type: (link.length == 0) ? 1 : 2,
            category: category
        };
        sendCommand('update_quiz', tmpObj);
    } else {
        sendCommand('create_quiz',{
            quiz: question,
            explaination: explaination,
            options: answers,
            anwers: correct_answer,
            extralink: link,
            type: (link.length == 0) ? 1 : 2,
            category: category
        });

        clearEditQuizZone();
    }
}

function sendCommand(command, data){
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
    $('#explaination').summernote({
            styleWithSpan: false,
            toolbar: [
                ['font', ['bold', 'italic', 'underline', 'clear']]
            ],
            lang: 'vi-VN'
    });

    category = $('.category_id').html();

    uploadFileForm = $("#cvfile").uploadFile({
        url:"/uploadfile",
        fileName: "file",
        onShowDown: function(fileName){
            setTimeout(function(){
                var responses = uploadFileForm.getResponses();
                if (responses.length == 0)
                    return;
                tmpfilename = responses[responses.length - 1];

                // Extra data
                $('#imgfile').val(tmpfilename);
                uploadFileForm.clearAll();
            },300);
        }
    });

    /**
     * quizlist click
     */
    $('#quizlist tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
});

function clearEditQuizZone(){
    $('#submit_quiz').html('Tạo mới');
    $('#question').code('');
    $('#explaination').code('');
    $("#quiz_id").html('');
    $('#imgfile').val('');

    for (var i=1;i<=6;i++){
        $('#opt' + i).val('');
        $('#chb' + i).prop('checked', false);
    }
    tmpfilename = '';
}

function bindDataTable(data){
    var convertArr = [];
    data.forEach(function(node){
        var row = [];
        row.push(node.quiz);
        row.push(node.explaination);
        row.push(node);
        convertArr.push(row);
    });

    oTable = $('#quizlist').DataTable( {
        data: convertArr,
        columns: [
            { title: "quiz" },
            { title: "explaination" },
        ]
    });

    $("#quizlist tbody").on('click', 'tr', function() {
        oTable.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        var data = oTable.row('.selected').data()[2];
        setTimeout(function() {
            oTable.$('tr.selected').removeClass('selected');
        }, 100);

        // Show the quiz
        $('#quizbtn').click();

        clearEditQuizZone();
        $('#submit_quiz').html('Cập nhật');
        $('#question').code(data.quiz);
        $('#explaination').code(data.explaination);
        $('#imgfile').val(data.extralink);
        for (var i = 1; i <= data.options.length; i++) {
            $('#opt' + i).val(data.options[i - 1]);
            $('#chb' + i).prop('checked', false);
        }
        for (var i = 0; i < data.anwers.length; i++) {
            $('#chb' + (data.anwers[i] + 1)).prop('checked', true);
        }
        $("#quiz_id").html(data._id);
    });
}