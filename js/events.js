/* Events
 * Bind these events to dom objects
 */
$('#logout-button').on('click', function(){
    signOff(true);
});

$('#main-content').on('click', '#generateCookieBtn', function(){
    simpleOpenAdskLogin(commonServer, true, false);
});

$('#reviews-create').on('click', '#create-review-attach', function(event){
    event.preventDefault();
    $('#photo-preview').show();
    $('#attach-review-image-file').click();
});

$('#reviews-create').on('click', '#create-review-submit-button', function(event){
    event.preventDefault();
    reviewSubmit();
});

$('#reviews-create').on('click', '#photo-preview-close', function(event){
    event.preventDefault();
    resetPhotoPreview();
});

$('#reviews-list').on('click', '.helpful-button', function(event){
    event.preventDefault();
    console.log($(this).data());
    helpfulSubmit($(this).data());
});

$('#reviews-list').on('click', '.review-header-report-a', function(event){
    event.preventDefault();
    $('.abuse-popup').remove();
    var myObj = {};
    myObj.reviewKey = $(this).data('reviewKey');
    var html    = abuse_template(myObj);
    $(this).closest('.review-header-report').append(html);

    //abuseSubmit($(this).data('reviewKey'));
});

$('#reviews-list').on('click', '.abuse-popup-button-submit', function(event){
    event.preventDefault();

    var myObj = {};
    myObj.reviewKey     = $(this).data('reviewKey');
    myObj.reason        = $(this).closest('.abuse-popup').find('.abuse-popup-select option:selected').val();
    myObj.description   = $(this).closest('.abuse-popup').find('.abuse-popup-textarea').val();

    $('.abuse-popup').remove();

    abuseSubmit(myObj);
});

$('#reviews-list').on('click', '.abuse-popup-button-cancel', function(event){
    event.preventDefault();
    $('.abuse-popup').remove();
});

$('#reviews-list').on('keypress', '.review-body-comment-box-input', function(event){
    if (event.which == 13) {
        event.preventDefault();
        $(this).data({body : $(this).val()});
        commentSubmit($(this).data());
    }
});

$('#reviews-list').on('click', '.review-body-comments-link-reply', function(){

    var myComment = $(this).closest('.review-body').find('.review-body-comment-box')
    if(myComment.hasClass('hidden') === true){
        myComment.removeClass('hidden');
    }else{
        myComment.addClass('hidden');
    }
});

$('#reviews-list').on('click', '.review-body-comments-link-show-all', function(){

    console.log($(this).data());
    var myLink = $(this);

    if(myLink.hasClass('replies-hidden') === true){
        myLink._removeClass('replies-hidden').addClass('replies-visible');
        getComments($(this).data('reviewKey'));
        myLink.html('<span>|</span> Hide replies');
    }else{
        myLink._removeClass('replies-visible').addClass('replies-hidden');
        myLink.html(myLink.data('replies-text'));
        myLink.closest('.review-body').find('.review-body-reply-list').empty();
    }
});
