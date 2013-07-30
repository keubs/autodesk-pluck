function fileSelection(){
    console.log('selected');
    $('#photo-preview').css('display', 'inline-block');
    $('#attach-review-submit').click();
}

function pluckPhotoUploadComplete(){
    console.log('got response');
    var resultsIframe = document.getElementById("photoUploadResults");
    if (!(!resultsIframe)) { //Make sure element exists
        var results = resultsIframe.contentWindow.document.body.innerHTML;
        var photoKey = results;
        if (results.length > 0) {
            //This check is just to make sure that we do not get back the script tag at the top of the response - we shouldn't since we are getting the body, but this makes sure.
            if (results.indexOf("script>") > 0) {
                photoKey = results.substr(results.indexOf("script>") + 7);
            }
            // DO SOMETHING WITH PHOTO KEY HERE
            //if (window.console && window.console.debug) window.console.debug('photoKey: '+photoKey);
            getImg(photoKey);

        }
    }
}

function getImg(photoKey){
    var request = new PluckSDK.ImageRequest();
    request.ImageId = photoKey;

    console.log(request);
    PluckSDK.SendRequests([request], defaultCallback);
}

function getReviewImg(photoKey){
    var request = new PluckSDK.PhotoRequest();
    var newKey = new PluckSDK.PhotoKey();
    newKey.Key = photoKey;

    request.PhotoKey = newKey;

//    console.log('get review img');
//    console.log(request);
    return (request);
}

function assocImg(newReviewKey){

    var imageId = $("#photo-preview").data('imageid');
    var myKey = {
        key: newReviewKey
    }

    if (imageId != null){

        //associate images
        var request = new PluckSDK.AddReviewPhotoActionRequest();

        var reviewKey = new PluckSDK.ReviewKey();
        reviewKey.Key = myKey.key;

        request.Title = 'Uploaded Image';
        request.Description = 'No description';
        request.ReviewKey = reviewKey;
        request.ImageID = imageId;

        console.log(request);
        PluckSDK.SendRequests([request], assocCallback);

    }

}

function showImg(url, imageId){
    console.log('image id: '+imageId);
    $("#photo-preview-img").attr('src', url);
    $("#photo-preview").data('imageid', imageId);
    //console.log($("#photo-preview").data());
    //assocImg(imageId);
}
