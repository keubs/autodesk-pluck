////////// DEFAULT CALLBACK ////////

function defaultCallback(responses) {
    console.log('defaultCallback');

    $.each(responses, function(index){

        var actionResponse = responses[index];

        console.log('actionResponse');
        console.log(actionResponse);

        if (actionResponse.ResponseStatus.StatusCode !== PluckSDK.ResponseStatusCode.OK) {

            if ( PluckSDK.ResponseExceptionChecker.wasUnauthorizedAttempt(actionResponse) ) {
                writeOutput("You're either not logged in or don't have permission to do that. (Duplicate reviews might not be allowed, depending on your server config.)");
            } else if ( PluckSDK.ResponseExceptionChecker.wasFloodAttempt(actionResponse) ) {
                writeOutput("Your submission was rejected due to rapid posting. Please try again later.");
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
                    if(actionResponse.ResponseStatus.Exceptions.length > 0){
                        if(actionResponse.ResponseStatus.Exceptions[0].Value == ""){
                            writeOutput("Some other error occurred. Please make sure you have completed the form and try again later.");
                        }else{
                            writeOutput(actionResponse.ResponseStatus.Exceptions[0].Value);
                        }
                        resetReviewForm();
                    }else{
                        writeOutput("Some other error occurred. Please try again later.");
                        resetReviewForm();
                    }

                }
            }

        } else {
            //Routing for misc callbacks
            switch(actionResponse.ObjectType){
                case "Responses.System.ActionResponse":
                    if(actionResponse.KeyActions.length > 0 ){

                        if(actionResponse.KeyActions[0].ActionType == "Created" && actionResponse.KeyActions[0].Key.ObjectType == "Models.Reactions.CommentKey"){
                            //This is a comment on review. Update corresponding model, however no comment key is returned.  nerf. update all.
                            console.log('this is a comment submission');
                            createCommentCallback();
                        }else{
                            console.log('new review created response');
                            assocImg(actionResponse.KeyActions[0].Key.Key);
                        }

                    }
                    break;
                case "Responses.Reactions.Reviews.ReviewsPageResponse":
                    reviewListCallback(actionResponse);
                    break;
                case "Responses.Reactions.CommentsPageResponse":
                    commentCallback(actionResponse);
                    break;
                case "Responses.Reactions.ItemScoresResponse":
                    //actionResponse.ItemScores[0].TargetKey.Key
                    //update model on this key but now, just refresh
                    itemScoreCallback();
                    break;
                case "Responses.Media.ImageResponse":
                    imgCallback(actionResponse);
                    break;
                default:
                    console.log('default callback case, nothing to do');
                //do nothing
            }

        }

    });

}


