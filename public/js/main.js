// Change custom-file-input box to show name of uploaded file
$('.custom-file-input').on('change',function(){
    //get the file name
    var fileName = $(this).val();

    //Remove the "C:\\fakepath\\example.doc" from the file name
    var filenameClean = fileName.replace(/^.*\\/, "");

    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(filenameClean);
});