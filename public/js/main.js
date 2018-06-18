//on document ready set value of return URL to be the value of the URL query string
$(document).ready(function(){
    $('#returnUrl').val(getUrlVars().return_url)
});

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


//*******************
// URL REDIRECTS
//*******************
// Script to send user to login/register with source URL when clicking on links

$('#navbarLogin').on('click', function(){
    event.preventDefault(); //Prevent default anchor click behavior
    window.location.href = "/login?return_url=" + window.location.pathname;
});

$('#navbarRegister').on('click', function(){
    event.preventDefault(); //Prevent default anchor click behavior
    window.location.href = "/inviteCode?return_url=" + window.location.pathname;
});

$('#commentLogin').on('click', function(){
    event.preventDefault(); //Prevent default anchor click behavior
    window.location.href = "/login?return_url=" + window.location.pathname;
});

$('#commentRegister').on('click', function(){
    event.preventDefault(); //Prevent default anchor click behavior
    window.location.href = "/inviteCode?return_url=" + window.location.pathname;
});




// Change custom-file-input box to show name of uploaded file
$('.custom-file-input').on('change',function(){
    //get the file name
    var fileName = $(this).val();

    //Remove the "C:\\fakepath\\example.doc" from the file name
    var filenameClean = fileName.replace(/^.*\\/, "");

    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(filenameClean);
});