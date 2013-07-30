/*
 * Global variables used to set pluck review ids and categories
 */
var commonServer = "http://pipe.autodesk.com/pluck_adsk/"
var guid         = $('meta[name=topicid]').attr("content");
var lang         = "en";
var title        = document.title;
var myId         = guid+lang;
var authValid    = false;

/* Ready state
 *  run these as soon as document is ready
 */
$(document).ready(function(){
//    var abuse    = abuse_template();
//    $('#main').prepend(abuse);
    immediateAdskLogin(commonServer, true, false);

});

/* Templating
 *  Use these to initialize Handlebars templates and helpers
 */
var review_template_source   = $("#review-template").html();
var review_template = Handlebars.compile(review_template_source);

var review_create_template_source =  $("#create-review").html();
var review_create_template = Handlebars.compile(review_create_template_source);

var abuse_template_source   = $("#abuse-template").html();
var abuse_template = Handlebars.compile(abuse_template_source);

Handlebars.registerHelper('is-helpful', function(data) {
    if(this.userScore > 0){
        var output = '<span class="helpful review-body-helpful-question">You gave this a positive review</span>';
    }else if(this.userScore < 0){
        var output = '<span class="helpful review-body-helpful-question">You gave this a negative review</span>';
    }else{
        var output = '<span class="helpful review-body-helpful-question">Did you find this comment useful?</span>\
                      <span class="helpful review-body-helpful-yes"><button class="helpful-button small-button" data-helpful="1" data-review-key="'+this.reviewKey+'">Yes</button></span>\
                      <span class="helpful review-body-helpful-no"><button class="helpful-button small-button" data-helpful="-1" data-review-key="'+this.reviewKey+'">No</button></span>';
    }
    return new Handlebars.SafeString(output);
});


/* Events
 * Bind these events to dom objects
 */
$('#logout-button').on('click', function(){
    signOff(true);
});

$('#main-content').on('click', '#generateCookieBtn', function(){
    simpleOpenAdskLogin(commonServer, true, false);
});

$('#reviews-create').on('click', '#create-review-submit-button', function(event){
    event.preventDefault();
    reviewSubmit();
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

/* Auth
 * These functions handle authentication along with the functions in cookieHelp.js
 */
function createAuthRequest(){
    var authRequest = new PluckSDK.EchoAuthTokenActionRequest();
    PluckSDK.SendRequests([authRequest], authCallback);
}

function authCallback(responses){
    if(responses[0].ResponseStatus.StatusCode === PluckSDK.ResponseStatusCode.OK){
        //create review posting enabled state
        authValid = true;
        console.log('user is logged in');
        var html    = review_create_template();
        $('#reviews-create').html(html);
        getReviews(myId, "ALL", true);
        console.log(myId);

    }else{
        authValid = false;
        $('#reviews-create').html('<input type="button" id="generateCookieBtn" class="small-button" value="Add a Comment"/>');
        //create review posting disabled state
        console.log('user is not logged in');
        $('iframe[name=iframe-immediate]').remove();
        getReviews(myId, "ALL", false);
    }
}

/* Global functions Pluck Reviews / Comments create, update, etc.
 * These functions handle creation of new reviews and review / comment related SDK requests
 */
function abuseSubmit(myKey){

    var parentKey = new PluckSDK.ExternalResourceKey();
    parentKey.Key = myId;

    var reviewKey = new PluckSDK.ReviewKey();
    reviewKey.Key = myKey.reviewKey;

    var myRequest = new PluckSDK.ReportAbuseActionRequest();
    myRequest.ScoreId = 'Review';
    myRequest.ParentKey = parentKey;
    myRequest.AbuseOnKey = reviewKey;
    myRequest.Reason = myKey.reason;
    myRequest.Description = myKey.description;

    console.log(myRequest);
    PluckSDK.SendRequests([myRequest], abuseCallback);
}

function commentSubmit(data){

    console.dir(data);

    var reviewKey = new PluckSDK.ReviewKey();
    reviewKey.Key = data.reviewKey;

    var commentRequest = new PluckSDK.CommentActionRequest();
    commentRequest.CommentedOnKey = reviewKey;
    commentRequest.OnPageUrl = window.location.href;
    commentRequest.OnPageTitle = $('title').html();
    commentRequest.Body = data.body;

    console.dir(commentRequest);

    PluckSDK.SendRequests([commentRequest], commentSubmitCallback);

}

function createReview(id, review){

    //create new article key
    var articleKey = new PluckSDK.ExternalResourceKey();
    articleKey.Key = id;

    //ensure article has been created
    var articleAction = new PluckSDK.UpdateArticleActionRequest();
    articleAction.ArticleKey = articleKey;
    articleAction.OnPageTitle = document.title;
    articleAction.OnPageUrl = location.href;
    articleAction.ReviewItemState = PluckSDK.ReviewItemState.Active;

    //create review
    var newReview = new PluckSDK.ReviewActionRequest();
    newReview.ReviewedKey = articleKey;
    newReview.ReviewTitle = review.title;
    newReview.ReviewBody = review.body;
    newReview.OnPageUrl  = location.href+'#reviews';
    newReview.OnPageTitle = document.title;
    newReview.ReviewRating = 3;
    newReview.ReviewPros = "acdReviewPro";
    newReview.ReviewCons = "acdReviewCons";
    newReview.ReviewIsRecommmended = true;

    var reviewRequest = new PluckSDK.ReviewsPageRequest();
    reviewRequest.ReviewedKey = articleKey;
    reviewRequest.ItemsPerPage = 1;
    reviewRequest.OneBasedOnPage = 1;

    PluckSDK.SendRequests([articleAction, newReview, reviewRequest], reviewSubmitCallback);

}

function checkReviewCreation(id){

    //create new article key
    var articleKey = new PluckSDK.ExternalResourceKey();
    articleKey.Key = id;

    var reviewRequest = new PluckSDK.ReviewsPageRequest();
    reviewRequest.ReviewedKey = articleKey;
    reviewRequest.ItemsPerPage = 1;
    reviewRequest.OneBasedOnPage = 1;

    PluckSDK.SendRequests([reviewRequest], prependSingleReviewCallback);
}

function getComments(articleId){

    var commentsPageRequest = new PluckSDK.CommentsPageRequest();
    commentsPageRequest.ItemsPerPage = 10;
    commentsPageRequest.CommentedOnKey = new PluckSDK.ReviewKey();
    commentsPageRequest.CommentedOnKey.Key = articleId;
    commentsPageRequest.CommentedOnKey.Type = "Review";
    commentsPageRequest.OneBasedOnPage = 1;

    console.log(commentsPageRequest);
    PluckSDK.SendRequests([commentsPageRequest], commentCallback);

}

function getReviews(articleId, ratingForFiltering) {

    var reviewsPageRequest = new PluckSDK.ReviewsPageRequest();
    reviewsPageRequest.ItemsPerPage = 100;
    reviewsPageRequest.ReviewedKey = new PluckSDK.ExternalResourceKey();
    reviewsPageRequest.ReviewedKey.Key = articleId;
    reviewsPageRequest.SortType = new PluckSDK.TimestampSort();
    reviewsPageRequest.SortType.SortOrder = "Descending";

    if (ratingForFiltering !== "ALL") {
        reviewsPageRequest.FilterType = new PluckSDK.ReviewRatingFilter();
        reviewsPageRequest.FilterType.Rating = ratingForFiltering;
    }

    reviewsPageRequest.OneBasedOnPage = 1;

    var requests = [];	//new array
    requests.push(reviewsPageRequest);

    PluckSDK.SendRequests(requests, reviewCallback);
}

function helpfulSubmit(data){

    var parentKey = new PluckSDK.ExternalResourceKey();
    parentKey.Key = myId;

    var reviewKey = new PluckSDK.ReviewKey();
    reviewKey.Key = data.reviewKey;

    console.log('creating helpfulSubmit');
    var myRequest = new PluckSDK.SetItemScoreActionRequest();
    myRequest.ScoreId = 'Review';
    myRequest.ParentKey = parentKey;
    myRequest.TargetKey = reviewKey;
    myRequest.Score = data.helpful;

    console.log(myRequest);

    PluckSDK.SendRequests([myRequest], itemScoreCallback);
}

function reviewSubmit(){
    var myReview = {};
    myReview.title = $('#create-review-title-input').val();
    myReview.body = $('#create-review-body-textarea').val();
    console.dir(myReview);
    createReview(myId, myReview);
}

function updateReview(id){

    //create new article key
    var articleKey = new PluckSDK.ExternalResourceKey();
    articleKey.Key = id;

    //ensure article has been created
    var articleAction = new PluckSDK.UpdateArticleActionRequest();
    articleAction.ArticleKey = articleKey;
    articleAction.OnPageTitle = document.title;
    articleAction.OnPageUrl = location.href;
    articleAction.ReviewItemState = PluckSDK.ReviewItemState.Active;

    PluckSDK.SendRequests([articleAction], reviewCallback);
}

/* Review / Comment Callbacks
 * Callback functions from pluck sdk requests.  Run these to perform operations on pluck responses.
 */

function abuseCallback(responses){
    if(responses[0].ResponseStatus.StatusCode === PluckSDK.ResponseStatusCode.OK){
        console.log(responses[0]);
        getReviews(myId, "ALL", true);
    }else{
        console.log(responses[0].ResponseStatus);
    }
}

function commentCallback(responses, articleId){

    if(responses[0].ResponseStatus.StatusCode === PluckSDK.ResponseStatusCode.OK){
        console.log(responses[0]);
        var reviewKey = responses[0].CommentedOnKey.Key;
        var reviewCount = responses[0].Items.length;

        writeOutput("\nFound " + reviewCount + " responses(s).");

        for (var reviewIdx = 0; reviewIdx < reviewCount; reviewIdx++) {

            var reply = responses[0].Items[reviewIdx];
            var replies_template_source   = $("#replies-template").html();
            var replies_template = Handlebars.compile(replies_template_source);

            var myReplyObj = {};
            myReplyObj.username = reply.Owner.DisplayName;
            myReplyObj.body     = reply.Body;
            myReplyObj.hours    = createPrettyDate(reply.PostedAtTime);

            var html    = replies_template(myReplyObj);
            $('.review-body-reply-list.'+reviewKey).prepend(html);
        }

        //getReviews(myId, "ALL", true);
        $('.review-body-comment-box-input').val('');

    }else{
        console.log(responses[0].ResponseStatus);
    }
}

function commentSubmitCallback(responses){
    if(responses[0].ResponseStatus.StatusCode === PluckSDK.ResponseStatusCode.OK){
        console.log(responses[0]);
        getReviews(myId, "ALL", true);
    }else{
        console.log(responses[0].ResponseStatus);
    }
}

function itemScoreCallback(responses){
    if(responses[0].ResponseStatus.StatusCode === PluckSDK.ResponseStatusCode.OK){
        console.log(responses[0]);
        getReviews(myId, "ALL", true);
    }else{
        console.log(responses[0].ResponseStatus);
    }
}

function prependSingleReviewCallback(responses) {

    var actionResponse = responses[0];
    var myReviewList =  [];

        if (actionResponse.ResponseStatus.StatusCode !== PluckSDK.ResponseStatusCode.OK) {

            if ( PluckSDK.ResponseExceptionChecker.wasUnauthorizedAttempt(actionResponse) ) {
                writeOutput("You're either not logged in or don't have permission to do that. (Duplicate reviews might not be allowed, depending on your server config.)");
            } else if ( PluckSDK.ResponseExceptionChecker.wasFloodAttempt(actionResponse) ) {
                writeOutput("Your submission was rejected due to rapid posting.");
            } else if ( PluckSDK.ResponseExceptionChecker.thresholdWasExceeded(actionResponse) ) {
                writeOutput("You have exceeded the number 'large' inputs (comments, reviews, photos, etc.) allowed for a given time period.");
            } else if ( PluckSDK.ResponseExceptionChecker.metadataWasRejected(actionResponse) ) {
                writeOutput("Your post was rejected due to metadata filtering such as your IP address.");
            } else {
                //check for dirty words
                var dirtyWordsUsed = PluckSDK.ResponseExceptionChecker.getDirtyWords(actionResponse);
                if (dirtyWordsUsed.length > 0) {
                    writeOutput( "Please remove the following words from your input: " + dirtyWordsUsed.join(" ") );
                } else {
                    /* if we get here, handle an "unexpected" error
                     * -- this would typically be a programming error and the
                     * detailed message returned will help you diagnose it
                     */
                    writeOutput("Some other error occurred");
                }
            }

        } else {
            //write some output
            var reviews = actionResponse.Items;
            var reviewCount = actionResponse.Items.length;

            writeOutput("\nFound " + reviewCount + " review(s).");

            for (var reviewIdx = 0; reviewIdx < reviewCount; reviewIdx++) {
                var review = reviews[reviewIdx];
                var myReviewObject = {};

                if (review.ContentBlockingState === PluckSDK.ContentBlockingEnum.BlockedByAdmin) {
                    writeOutput('Blocked Post');
                }else{

                    myReviewObject.username      = 'by '+ review.Owner.DisplayName;
                    myReviewObject.title         = review.Title;
                    myReviewObject.body          = review.Body;
                    myReviewObject.createDate    = review.DatePosted;
                    myReviewObject.reviewKey     = review.ReviewKey.Key;
                    myReviewObject.userScore     = review.ItemScore.CurrentUserScore;
                    myReviewObject.positiveCount = review.ItemScore.PositiveCount;
                    myReviewObject.absoluteScore = review.ItemScore.AbsoluteScore;

                    if(review.Comments.NumberOfComments > 0){
                        myReviewObject.replies       = '<span class="no-link"> |</span> Show all replies ('+ review.Comments.NumberOfComments + ')';
                    }

                }

                var html    = review_template(myReviewObject);
                myReviewList.push(html);



            }
        }

        $('#reviews-list').prepend(myReviewList);
        //basic paginate
        $('#reviews').pajinate({
            num_page_links_to_display : 4,
            items_per_page : 2
        });
}

function reviewCallback(responses) {

    var actionResponse = responses[0];
    var myReviewList =  [];

    if (actionResponse.ResponseStatus.StatusCode !== PluckSDK.ResponseStatusCode.OK) {

        if ( PluckSDK.ResponseExceptionChecker.wasUnauthorizedAttempt(actionResponse) ) {
            writeOutput("You're either not logged in or don't have permission to do that. (Duplicate reviews might not be allowed, depending on your server config.)");
        } else if ( PluckSDK.ResponseExceptionChecker.wasFloodAttempt(actionResponse) ) {
            writeOutput("Your submission was rejected due to rapid posting.");
        } else if ( PluckSDK.ResponseExceptionChecker.thresholdWasExceeded(actionResponse) ) {
            writeOutput("You have exceeded the number 'large' inputs (comments, reviews, photos, etc.) allowed for a given time period.");
        } else if ( PluckSDK.ResponseExceptionChecker.metadataWasRejected(actionResponse) ) {
            writeOutput("Your post was rejected due to metadata filtering such as your IP address.");
        } else {
            //check for dirty words
            var dirtyWordsUsed = PluckSDK.ResponseExceptionChecker.getDirtyWords(actionResponse);
            if (dirtyWordsUsed.length > 0) {
                writeOutput( "Please remove the following words from your input: " + dirtyWordsUsed.join(" ") );
            } else {
                /* if we get here, handle an "unexpected" error
                 * -- this would typically be a programming error and the
                 * detailed message returned will help you diagnose it
                 */
                writeOutput("Some other error occurred");
            }
        }

    } else {
        //write some output
        var reviews = actionResponse.Items;
        var reviewCount = actionResponse.Items.length;

        for (var reviewIdx = 0; reviewIdx < reviewCount; reviewIdx++) {

            var review = reviews[reviewIdx];
            var myReviewObject = {};

            if (review.ContentBlockingState === PluckSDK.ContentBlockingEnum.BlockedByAdmin) {
                writeOutput('Blocked Post');
            }else{

                myReviewObject.username      = 'by '+ review.Owner.DisplayName;
                myReviewObject.title         = review.Title;
                myReviewObject.body          = review.Body;
                myReviewObject.createDate    = createPrettyDate(review.DatePosted);
                myReviewObject.reviewKey     = review.ReviewKey.Key;
                myReviewObject.userScore     = review.ItemScore.CurrentUserScore;
                myReviewObject.positiveCount = review.ItemScore.PositiveCount;
                myReviewObject.absoluteScore = review.ItemScore.AbsoluteScore;

                if(review.Comments.NumberOfComments > 0){
                    myReviewObject.replies       = '<span class="no-link"> |</span> Show all replies ('+ review.Comments.NumberOfComments + ')';
                }

            }

            var html    = review_template(myReviewObject);
            myReviewList.push(html);

        }
    }

    //basic paginate
    paginateReviewList(myReviewList);

}

function reviewSubmitCallback(responses) {
    //if (window.console && window.console.dir) window.console.dir(responses);
    checkReviewCreation(myId);
    $('#create-review-title-input').val('');
    $('#create-review-body-textarea').val('');
}


/* Utils
 * Basic utilities
 */

function itemNotFound(responseObj){
    //console.dir(responseObj);
}

function writeOutput(text){
    console.log(text);
}

function createDefaultPluckApp() {
    pluckAppProxy.embedApp("pluck_reviews_list", {
        plckArticleTitle: 'title',
        plckArticleUrl: window.location.href,
        plckReviewOnKey: myId,
        plckReviewOnKeyType: "article"
    },{elem: "default-reviews"});
}

function createPagination(totalItems){

    var myPageList = [];
    console.log(totalItems);
    for(var i = 0; i < (totalItems / 2); i++){
        myPageList.push($('<li></li>',{
            "html": i
        }));
    }
    $('#reviews-pagination-list').append(myPageList);

    $('#reviews-pagination-list').pajinate({
        num_page_links_to_display : 3,
        items_per_page : 6
    });
}

function createPrettyDate(dateString){
    var dateObj     = new Date(dateString);
    var prettyDate  = dateObj.toLocaleDateString();
        prettyDate  = prettyDate.replace(/\//g, "-");

    return prettyDate;
}

function paginateReviewList(myReviewList){
    //Create pagination
    $('#reviews-list').html(myReviewList);
    $('#reviews').pajinate({
        num_page_links_to_display : 4,
        items_per_page : 2
    });

}

