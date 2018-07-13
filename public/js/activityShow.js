//Script to change focus to comment input when add comment button is clicked
$('#addCommentBtn').click(function(){
    setTimeout(function() {
        $('#addCommentInput').focus();
    }, 100);
});

//Script to change focus to update request input when "Something not right?"" button is clicked
$('#addUpdateRequestBtn').click(function(){
    setTimeout(function() {
        $('#addUpdateRequestInput').focus();
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

//Script to scroll to "Something not right?" section when createNewUpdateRequestBtn is clicked -->
$('#createNewUpdateRequestBtn').on('click', function(){
    event.preventDefault(); //Prevent default anchor click behavior
    var hash = "#addUpdateRequestBtn";
    
    $('html, body').animate({
        scrollTop: $(hash).offset().top
    }, 800, function(){
        window.location.hash = hash;
    });
    
});

//Script to scroll to "Something not right?" section when "Update=true" in query param on load
$(document).ready(function(){
    
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    
    if(getParameterByName('update') === "true") {
        var hash = "#addUpdateRequestBtn";
        
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 800, function(){
            window.location.hash = hash;
        });
        
        //expand 
        $('#collapseAddUpdateRequest').collapse();
    }
    
});