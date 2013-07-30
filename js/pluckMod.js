/*
 * Global variables used to set pluck review ids and categories
 */
document.domain = "autodesk.com";

var commonServer = "http://pipe.autodesk.com/pluck_adsk/";
var guid         = $('meta[name=topicid]').attr("content");
var product      = $('meta[name=product]').attr("content");
var lang         = "en";
var title        = document.title;
var contentKey   = guid+lang;
var authValid    = false;

//create new article key
var masterContentKey = new PluckSDK.ExternalResourceKey();
masterContentKey.Key = contentKey;

/* Ready state
 *  run these as soon as document is ready
 */
$(document).ready(function(){

    immediateAdskLogin(commonServer, true, false);

});

/* Auth
 * These functions handle authentication along with the functions in cookieHelp.js
 */
function createAuthRequest(){
    var authRequest = new PluckSDK.EchoAuthTokenActionRequest();
    PluckSDK.SendRequests([authRequest], authCallback);
}

/* Global functions Pluck Reviews / Comments create, update, etc.
 * These functions handle creation of new reviews and review / comment related SDK requests
 */

function abuseSubmit(myKey){

    var reviewKey = new PluckSDK.ReviewKey();
    reviewKey.Key = myKey.reviewKey;

    var myRequest = new PluckSDK.ReportAbuseActionRequest();
    myRequest.ScoreId = 'Review';
    myRequest.ParentKey = masterContentKey;
    myRequest.AbuseOnKey = reviewKey;
    myRequest.Reason = myKey.reason;
    myRequest.Description = myKey.description;

    console.log(myRequest);
    PluckSDK.SendRequests([myRequest], defaultCallback);
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

    PluckSDK.SendRequests([commentRequest], defaultCallback);

}

function createReview(review){

    //ensure article has been created
    var articleAction = new PluckSDK.UpdateArticleActionRequest();
    articleAction.ArticleKey = masterContentKey;
    articleAction.OnPageTitle = document.title;
    articleAction.OnPageUrl = location.href;
    articleAction.ReviewItemState = PluckSDK.ReviewItemState.Active;

    //create review
    var newReview = new PluckSDK.ReviewActionRequest();
    var categories = new PluckSDK.DiscoveryCategory();
    categories.Name = [product];

    newReview.ReviewedKey = masterContentKey;
    newReview.ReviewTitle = review.title;
    newReview.ReviewBody = review.body;
    newReview.OnPageUrl  = location.href+'#reviews';
    newReview.OnPageTitle = document.title;
    newReview.ReviewRating = 3;
    newReview.ReviewPros = "DefaultPro";
    newReview.ReviewCons = "DefaultCons";
    newReview.ReviewIsRecommmended = true;
    newReview.Categories = categories.Name;

    console.dir(newReview);
    PluckSDK.SendRequests([articleAction, newReview], defaultCallback);

}

function getSingleReview(){

    var reviewRequest = new PluckSDK.ReviewsPageRequest();
    reviewRequest.ReviewedKey = masterContentKey;
    reviewRequest.ItemsPerPage = 1;
    reviewRequest.OneBasedOnPage = 1;
    PluckSDK.SendRequests([reviewRequest], defaultCallback);
}

function checkReviewCreation(){

    var reviewRequest = new PluckSDK.ReviewsPageRequest();
    reviewRequest.ReviewedKey = masterContentKey;
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
    PluckSDK.SendRequests([commentsPageRequest], defaultCallback);

}

function getReviews(ratingForFiltering) {

    var reviewsPageRequest = new PluckSDK.ReviewsPageRequest();

    reviewsPageRequest.ReviewedKey = masterContentKey;
    reviewsPageRequest.SortType = new PluckSDK.TimestampSort();
    reviewsPageRequest.SortType.SortOrder = "Descending";

    reviewsPageRequest.ItemsPerPage = 100;
    reviewsPageRequest.OneBasedOnPage = 1;

    if (ratingForFiltering !== "ALL") {
        reviewsPageRequest.FilterType = new PluckSDK.ReviewRatingFilter();
        reviewsPageRequest.FilterType.Rating = ratingForFiltering;
    }

    PluckSDK.SendRequests([reviewsPageRequest], defaultCallback);
}

function reviewObject(review){

    var reviewObject = {

        username      : 'by '+ review.Owner.DisplayName,
        title         : review.Title,
        body          : review.Body,
        createDate    : createPrettyDate(review.DatePosted),
        reviewKey     : review.ReviewKey.Key,
        userScore     : review.ItemScore.CurrentUserScore,
        positiveCount : review.ItemScore.PositiveCount,
        absoluteScore : review.ItemScore.AbsoluteScore

    };

    if(review.Comments.NumberOfComments > 0){
        reviewObject.replies = '<span class="no-link"> |</span> Show all replies ('+ review.Comments.NumberOfComments + ')'
    }

    //Check for photos
    if(review.PhotoKeys.length >= 1){
        reviewObject.photoKey = review.PhotoKeys[0].Key;
        getPhotoUrl(review.PhotoKeys[0].Key);
    }

    return reviewObject;

}

function helpfulSubmit(data){

    var reviewKey = new PluckSDK.ReviewKey();
    reviewKey.Key = data.reviewKey;

    console.log('creating helpfulSubmit');
    var myRequest = new PluckSDK.SetItemScoreActionRequest();
    myRequest.ScoreId = 'Review';
    myRequest.ParentKey = masterContentKey;
    myRequest.TargetKey = reviewKey;
    myRequest.Score = data.helpful;

    console.log(myRequest);

    PluckSDK.SendRequests([myRequest], defaultCallback);
}

function reviewSubmit(){

    var myReview = {};

    myReview.title      = $('#create-review-title-input').val();
    myReview.body       = $('#create-review-body-textarea').val();
    myReview.imageId    = $("#photo-preview").data();
    console.log('myReview submit: ');
    console.dir(myReview);

    createReview(myReview);
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

    PluckSDK.SendRequests([articleAction], defaultCallback);
}


