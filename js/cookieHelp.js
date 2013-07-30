// HOST FILE ENTRY  54.241.213.150 dev1akn.autodesk.com
var openIDProvider  = "https://accounts-staging.autodesk.com";
var userServiceUrl  = "http://akn.publisher-staging.autodesk.com";
var adskLogout      = openIDProvider + "/Authentication/LogOut?ReturnToUrl=";

function deleteCookie() {

    var data = "";
    var returnConsumerUrl = encodeURIComponent(window.location.href);

    $.ajax({
        data: data,
        url: userServiceUrl+"/aknuserservices/pluck/droppluckcookie",
        type: 'GET',
        contentType: "application/json",
        crossDomain:true,
        dataType: "jsonp",
        error: function(err){
            alert("error is" + err);
            console.log(err);
        },
        success: function(data){
            console.log("succes is" + data);
            window.location = window.location;
            window.location = adskLogout + returnConsumerUrl;

        }
    });
}

function generateCookie() {

    //THIS IS NOT USED

    var data = "namePerson="+""+"&userid="+""+"&first="+""+"&last="+""+"&email="+"";

    $.ajax({
        data: data,
        url: userServiceUrl+"/aknuserservices/pluck/generatepluckcookie",
        type: 'GET',
        crossDomain:true,
        contentType: "application/json",
        dataType: "jsonp",
        error: function(err){
            alert("error is" + err);
            console.log(err);
        },
        success: function(data){
            console.log("succes is" + data);
            window.location = window.location;

        }
    });
}

function getCookieData() {

    //THIS IS NOT USED

    var data ="namePerson="+""+"&userid="+""+"&first="+""+"&last="+""+"&email="+"";
    $.ajax({
        data: data,
        url: userServiceUrl+"/aknuserservices/pluck/createpluckcookiedata",
        type: 'GET',
        crossDomain:true,
        contentType: "application/json",
        dataType: "jsonp",
        error: function(err){
            alert("error is" + err);
            console.log(err);
        },
        success: function(data){
            console.log("succes is" + data);
            $.each(data, function(key, val) {
                console.log("key is" + key);
                console.log("value is" + val);
            });
        }
    });
}

function logOut(){
    deleteCookie();
    window.location = adskLogout;
}

function oxygenSignOff() {
    var returnConsumerUrl = encodeURIComponent(window.location.href);
    window.location = adskLogout + returnConsumerUrl;
}

function immediateAdskLogin(myCommonServer, pluckCookie, stateLess) {

    var returnConsumerUrl   = encodeURIComponent(myCommonServer + "refresh.html");
    var data                = "identifier="+openIDProvider+"&returnUrl="+ returnConsumerUrl +"&stateLess="+stateLess+"&pluckCookie="+pluckCookie;

    $.ajax({
        data: data,
        url: userServiceUrl + "/aknuserservices/user/openid/checkidimmediate",
        type: 'GET',
        crossDomain:true,
        contentType: "application/json",
        dataType: "jsonp",
        //timeout: 10000,

        error: function(err){
            console.log("error" +err);

        },

        success: function(data){

            if(!stateLess && data["CONSUMER_RESPONSE_DATA"] ){

                createAuthRequest();
            }
            else if(data["REDIRECT_URL"]){

                var url = data["REDIRECT_URL"];

                var iframe = iFrameCreate("iframe-immediate", url, createAuthRequest);
                $(iframe).appendTo('body');

            }
        }

    });
}

function signOff(pluckCookie) {

    var data ="pluckCookie="+pluckCookie + '&userid=""' ;
    $.ajax({
        data: data,
        url: userServiceUrl+"/aknuserservices/user/openid/signoff",
        type: 'GET',
        crossDomain:true,
        contentType: "application/json",
        dataType: "jsonp",
        error: function(err){
            alert("error is" + err);
            console.log(err);
        },
        success: function(data){
            console.log("succes is" + data);
            oxygenSignOff();
            $.each(data, function(key, val) {
                console.log("key is" + key);
                console.log("value is" + val);
            });
        }
    });
}

function simpleOpenAdskLogin(myCommonServer, pluckCookie,stateLess) {

    var returnConsumerUrl   = encodeURIComponent(myCommonServer+"CloseWin.html");
    var data                = "identifier="+openIDProvider+"&pluckCookie="+pluckCookie+"&returnUrl="+ returnConsumerUrl +"&stateLess="+stateLess;

    $.ajax({
        data: data,
        url: userServiceUrl + "/aknuserservices/user/openid/signin",
        type: 'GET',
        crossDomain:true,
        contentType: "application/json",
        dataType: "jsonp",

        //timeout: 10000,
        error: function(err){
            console.log("error" +err);

        },
        success: function(data){

            console.log("success " + data);

            $.each(data, function(key, val) {

                if(key == 'REDIRECT_URL') {

                    $('#oxygen-container').remove();

                    var url = val;

                    var iframe = iFrameCreate('iframe-simple-login', url, windowRefresh);

                    $('<div></div>', {
                       "id" : 'oxygen-container'
                    }).appendTo('body');

                    $(iframe).width('350px').height('356px');
                    $('#oxygen-container').html($(iframe));
                    $('#oxygen-container').prepend('<div id="oxygen-closebtn"></div>');
                    $('#oxygen-closebtn').on('click', function(e){
                        e.preventDefault();
                        console.log('closing');
                        $(this).parent().remove();
                    });

                }
            });
        }

    });
}

function windowRefresh() {

    //window.location = window.location;

}

var iFrameCreate = function(name, href, onload) {
    var element = document.createElement('iframe');

    element.setAttribute('name', name);
    element.setAttribute('frameBorder', '0');
    element.setAttribute('hspace', '0');
    element.setAttribute('scrolling', 'no');
    element.setAttribute('src', href);
    element.setAttribute('allowtransparency', 'true');
    element.style.border = 'none';

    if (onload) jQuery(element).bind('load', onload);


    return element;
};
