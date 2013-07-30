/* Super Generic Callbacks */
function createCommentCallback(){
    getReviews("ALL");
}

function genericCallback(){
    getReviews("ALL");
}

function abuseCallback(){
    getReviews("ALL");
}

function itemScoreCallback(){
    getReviews("ALL");
}

// Useful Callbacks
//

function reviewListCallback(responseObject){
    //Begin creating individual reviews from list of reviews
    var reviews = responseObject.Items;
    var reviewCount = responseObject.Items.length;
    var reviewList = [];

    for (var reviewIdx = 0; reviewIdx < reviewCount; reviewIdx++) {

        var review = reviews[reviewIdx];

        if (review.ContentBlockingState !== PluckSDK.ContentBlockingEnum.BlockedByAdmin) {
            var formattedReview = reviewObject(review);
        }

        reviewList.push(review_template(formattedReview));

    }

    console.log(reviewList.length);

    if(reviewList.length == 1){
        $('#reviews-list').prepend(reviewList);
    }else{
        $('#reviews-list').html(reviewList);
    }

    paginateReviewList();
}

/* Review / Comment Callbacks
 * Callback functions from pluck sdk requests.  Run these to perform operations on pluck responses.
 */

function commentCallback(response){

    console.log(response);
    var reviewKey = response.CommentedOnKey.Key;
    var reviewCount = response.Items.length;

    for (var reviewIdx = 0; reviewIdx < reviewCount; reviewIdx++) {

        var reply = response.Items[reviewIdx];
        var replies_template_source   = $("#replies-template").html();
        var replies_template = Handlebars.compile(replies_template_source);

        var myReplyObj = {};
        myReplyObj.username = reply.Owner.DisplayName;
        myReplyObj.body     = reply.Body;
        myReplyObj.hours    = createPrettyDate(reply.PostedAtTime);

        var html    = replies_template(myReplyObj);
        $('.review-body-reply-list.'+reviewKey).prepend(html);
    }

    $('.review-body-comment-box-input').val('');

}

function getPhotoUrl(photoKey){
    //console.log('in get photo url');
    var req = getReviewImg(photoKey);
    PluckSDK.SendRequests([req], response);

    function response(responses){
//        console.log('get photo url request!');
//        console.log(responses);
        var thumbUrl  = responses[0].Photo.Image.SmallPendingApproval;
        var fullUrl  = responses[0].Photo.Image.FullPendingApproval;
        var selectorKey =  responses[0].Photo.PhotoKey.Key;

        $('#'+selectorKey).find('img').attr('src', thumbUrl);
        $('#'+selectorKey).attr('href', fullUrl);

//        imgTag = '<img src="'+myObj.thumbUrl+'" width="100px" height="100px"/>';
//        console.log('my img tag: '+imgTag);

    }
}

function authCallback(responses){
    if(responses[0].ResponseStatus.StatusCode === PluckSDK.ResponseStatusCode.OK){
        //create review posting enabled state
        authValid = true;
        console.log('user is logged in');
        console.dir(responses);

        var html    = review_create_template();
        $('#reviews-create').html(html);

        getReviews("ALL");

    }else{
        authValid = false;
        $('#reviews-create').html('<input type="button" id="generateCookieBtn" class="small-button" value="Add a Comment"/>');
        //create review posting disabled state
        console.log('user is not logged in');
        $('iframe[name=iframe-immediate]').remove();
        getReviews("ALL");
    }
}

function imgCallback(response){
    console.log('img callback');
    console.log(response);
    showImg(response.Image.SmallPendingApproval, response.Image.ImageId);
}

function getReviewImgCallback(responses){
    console.log('review img callback');
    console.log(responses);
    return(responses[0].Photo.Image.SmallPendingApproval);
}

function assocCallback(responses){
    resetReviewForm();
    getSingleReview();
}

function reviewSubmitCallback(responses) {

    console.log('callback img id:'+$('#'));
    var actionResponse = responses[1];
    console.log(actionResponse);

    console.log('newly created key: '+ actionResponse.KeyActions[0].Key.Key);
    assocImg(actionResponse.KeyActions[0].Key.Key);
    checkReviewCreation(contentKey);
    resetReviewForm();
}
