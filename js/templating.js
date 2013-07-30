
/* Templating
 *  Use these to initialize Handlebars templates and helpers
 */
var review_template_source   = $("#review-template").html();
var review_template = Handlebars.compile(review_template_source);

var review_create_template_source =  $("#create-review-template").html();
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


