/* Utils
 * Basic utilities
 */

function itemNotFound(responseObj){
    //console.dir(responseObj);
}

function writeOutput(text){
    alert(text);
}

function createDefaultPluckApp() {
    pluckAppProxy.embedApp("pluck_reviews_list", {
        plckArticleTitle: 'title',
        plckArticleUrl: window.location.href,
        plckReviewOnKey: contentKey,
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

function paginateReviewList(){
    //Create pagination
    $('#reviews').pajinate({
        num_page_links_to_display : 4,
        items_per_page : 2
    });

}

function resetReviewForm(){
    $('#create-review-title-input').val('');
    $('#create-review-body-textarea').val('');
    resetPhotoPreview();
}

function resetPhotoPreview(){
    $('#photo-preview').hide().data('imageid', '');
    $('#photo-preview-img').attr('src', '');
    $('#photoUploadResults').empty();

}
