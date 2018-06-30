//Script to change focus to comment input when add comment button is clicked
$('#addCommentBtn').click(function(){
    setTimeout(function() {
        $('#addCommentInput').focus();
    }, 100);
});

//Script to track comment input length
//if between 500 and 1000 show character count
$('#addCommentInput').keyup(function(){
    var commentLength = $(this).val().length;
    
    if(commentLength > 1500 && commentLength < 2001) {
        $('#commentErrorDiv').html("Comment Length: " + commentLength + "/2000");
        $('#commentErrorDiv').removeClass("alert-danger");
        $('#commentErrorDiv').addClass("alert-warning");
        $('#postNewCommentBtn').prop('disabled', false);
    } else if(commentLength >= 2001) {
        //if over 2000 then disabled button (as this just needs to be browser side validation as the endpoint has additional validation)
        $('#commentErrorDiv').html("Comment Length: " + commentLength + "/2000");
        $('#commentErrorDiv').removeClass("alert-warning");
        $('#commentErrorDiv').addClass("alert-danger");
        $('#postNewCommentBtn').prop('disabled', true);
    } else {
        $('#commentErrorDiv').removeClass("alert-warning");
        $('#commentErrorDiv').removeClass("alert-danger");
        $('#commentErrorDiv').html("");
        $('#postNewCommentBtn').prop('disabled', false);
    }
})


//Script to show/hide check delete buttons
//show confirmation buttons
$('.commentDeleteBtnDiv').on('click', function(){
    $(this).children('.commentDeleteBtn').hide();
    $(this).children('.commentDeleteCheck').show();
    $(this).siblings().hide();
});

//hide confirmation buttons
$('.commentNoDeleteBtn').on('click', function(){
    event.stopPropagation();
    $(this).parent().hide();
    $(this).parent().siblings().show();
    $(this).parent().parent().siblings().show();
});

//Script to scroll to comments section when comment bubble is clicked -->
function scrollToComments() {
    event.preventDefault(); //Prevent default anchor click behavior
    var hash = "#commentSection";
    
    $('html, body').animate({
        scrollTop: $(hash).offset().top
    }, 800, function(){
        window.location.hash = hash;
    });
}