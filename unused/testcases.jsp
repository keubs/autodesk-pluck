
<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
         <title>Test Cases</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

	<script type="text/javascript" src="/aknuserservices/resources/js/step2popup.js"></script>

    </head>
    <body>
     TEST CASES
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>
       <br/><br/>
       1) Generate Pluck cookie
       <br/><br/>
     <input type="button" onclick="generateCookie();" id="generateCookieBtn" value="Generate Cookie"/>


      <br/><br/>
           2) Delete Pluck cookie
            <br/><br/>
     <input type="button" onclick="deleteCookie();" id="deleteCookieBtn" value="Delete Cookie"/>

     <br/><br/>
                3) Get  cookie data
                 <br/><br/>
     <input type="button" onclick="getCookieData();" id="getCookieBtn" value="Get  Cookie Data"/>

      <br/><br/>
                     3a) Check pluck   cookie
                      <br/><br/>
          <input type="button" onclick="pluckcookieexists();" id="pluckcookieexists" value="Check  pluckcookieexists"/>

      <br/><br/>
                     4) Sign In
                      <br/><br/>
                      <input type="button" onclick="simpleOpenAdskLogin(false,true);" id="simpleOpenAdskLogin" value="Sign In using your Autodesk Login"/>

    <br/><br/>
                        5) Check Immidiate
                         <br/><br/>
                         <input type="button" onclick="immediateAdskLogin(false,true);" id="immediateAdskLogin" value="Check Immediate using your Autodesk Login"/>

   <br/><br/>
                        6) Sign In with Pluck Cookie Created
                         <br/><br/>
                         <input type="button" onclick="simpleOpenAdskLogin(true,true);" id="simpleOpenAdskLogin" value="Sign In using your Autodesk Login + Pluck"/>

       <br/><br/>
                           7) Check Immidiate with pluck cookie created or deleted
                            <br/><br/>
                            <input type="button" onclick="immediateAdskLogin(true,true);" id="immediateAdskLogin" value="Check Immediate using your Autodesk Login + Pluck"/>

     <br/><br/>
                           8) Sign In with Pluck Cookie Created and Local Copy of Data Session
                            <br/><br/>
                            <input type="button" onclick="simpleOpenAdskLogin(true,false);" id="simpleOpenAdskLogin" value="Sign In using your Autodesk Login +Pluck + Local Copy"/>

          <br/><br/>
                              9) Check Immidiate with pluck cookie created or deleted and Local Copy of Data Session
                               <br/><br/>
                               <input type="button" onclick="immediateAdskLogin(true,false);" id="immediateAdskLogin" value="Check Immediate using your Autodesk Login + Pluck + Local Copy"/>

  <br/><br/>
                              10) Get Local Copy of Data Session
                               <br/><br/>
                               <input type="button" onclick="getUserData();" id="getUserData" value="Get Local Copy of Data Session"/>

  <br/><br/>
                              11) Delete Local Copy of Data Session + Pluck
                               <br/><br/>
                               <input type="button" onclick="signOff(true);" id="signOff" value="Delete Local Copy of Data Session + Pluck"/>

      <script type="text/javascript">
		// HOST FILE ENTRY  54.241.213.150 dev1akn.autodesk.com
		//var userServiceUrl ="http://dev1akn.autodesk.com:8080";
		var userServiceUrl="";
		var returnConsumerUrl=encodeURIComponent("http://mycloud-staging.autodesk.com:8080/aknuserservices/resources/html/CloseWin.html");
           function generateCookie() {

           //var data ={"namePerson":"parveen deswal","userid":"P33RQK4NHSBT","first":"parveen","last":"deswal","email":"parveen.deswal@autodesk.com"}
           //var dataJsonRequest = JSON.stringify(data);
             //console.log('my dataJsonRequest: '+dataJsonRequest);
	var data ="namePerson=parveen deswal&userid=P33RQK4NHSBT&first=parveen&last=deswal&email=parveen.deswal@autodesk.com";



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

             }
           });
           }

           function getCookieData() {

	            /* var data ={"namePerson":"parveen deswal","userid":"P33RQK4NHSBT","first":"parveen","last":"deswal","email":"parveen.deswal@autodesk.com"}

	             var dataJsonRequest = JSON.stringify(data);

	              console.log('my dataJsonRequest: '+dataJsonRequest); */
	              var data ="namePerson=parveen deswal&userid=P33RQK4NHSBT&first=parveen&last=deswal&email=parveen.deswal@autodesk.com";
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
  function pluckcookieexists() {

	              var data ="";
	           $.ajax({
	                data: data,
	                url: userServiceUrl+"/aknuserservices/pluck/pluckcookieexists",
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

            function deleteCookie() {

	      var data ="";

	     // var dataJsonRequest = JSON.stringify(data);


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

		}
	      });
           }


function simpleOpenAdskLogin(pluckCookie,stateLess) {
	//var url ="https://accounts.autodesk.com/SignIn?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.return_to=http%3A%2F%2Fmycloud-staging.autodesk.com%3A8080%2FOpenIDConsumer%2Fconsumer%3Fis_return%3Dtrue%26isPopup%3Dtrue&openid.realm=http%3A%2F%2Fmycloud-staging.autodesk.com%3A8080%2FOpenIDConsumer%2Fconsumer%3Fis_return%3Dtrue%26isPopup%3Dtrue&openid.assoc_handle=%7B635056139150347903%7D%7B3Y7c0g%3D%3D%7D%7B32%7D&openid.mode=checkid_setup&openid.ns.ext1=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fui%2F1.0&openid.ext1.mode=popup&openid.ns.ext2=http%3A%2F%2Fopenid.net%2Fsrv%2Fax%2F1.0&openid.ext2.mode=fetch_request&openid.ext2.type.email=http%3A%2F%2Faxschema.org%2Fcontact%2Femail&openid.ext2.type.fullname=http%3A%2F%2Faxschema.org%2FnamePerson&openid.ext2.type.firstname=http%3A%2F%2Faxschema.org%2FnamePerson%2Ffirst&openid.ext2.type.lastname=http%3A%2F%2Faxschema.org%2FnamePerson%2Flast&openid.ext2.type.dob=http%3A%2F%2Faxschema.org%2FbirthDate&openid.ext2.if_available=dob&openid.ext2.type.gender=http%3A%2F%2Faxschema.org%2Fperson%2Fgender&openid.ext2.type.postcode=http%3A%2F%2Faxschema.org%2Fcontact%2FpostalCode%2Fhome&openid.ext2.type.country=http%3A%2F%2Faxschema.org%2Fcontact%2Fcountry%2Fhome&openid.ext2.type.language=http%3A%2F%2Faxschema.org%2Fpref%2Flanguage&openid.ext2.type.timezone=http%3A%2F%2Faxschema.org%2Fpref%2Ftimezone&openid.ext2.type.userid=http%3A%2F%2Faxschema.org%2Fautodesk%2Fuserid&openid.ext2.type.roles=http%3A%2F%2Faxschema.org%2Fautodesk%2Froles&openid.ext2.type.nickname=http%3A%2F%2Faxschema.org%2FnamePerson%2Ffriendly&openid.ext2.required=email%2Cfullname%2Cfirstname%2Clastname%2Cgender%2Cpostcode%2Ccountry%2Clanguage%2Ctimezone%2Cuserid%2Croles%2Cnickname&openid.ns.ext3=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Foauth%2F1.0&openid.ext3.consumer=mycloud-staging.autodesk.com";
	//var popupOpener = popupManager.createPopupOpener(myLoginCheckFunction, url);
        //popupOpener.popup(450,500);

        var data ="identifier=http://accounts.autodesk.com&pluckCookie="+pluckCookie+"&returnUrl="+ returnConsumerUrl +"&stateLess="+stateLess;


	         $.ajax({
	              data: data,
	              url: userServiceUrl+"/aknuserservices/user/openid/signin",
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
			 // myLoginCheckFunction();
			 $.each(data, function(key, val) {
			 				   console.log("key is" + key);
			 				    console.log("value is" + val);
			 		if(key=='REDIRECT_URL') {
			 		var url =val;
					var popupOpener = popupManager.createPopupOpener(myLoginCheckFunction, url);
       					popupOpener.popup(450,500);
			 		}
				});
			}

		});
	}

	function immediateAdskLogin(pluckCookie,stateLess) {
		 //var returnConsumerUrl=encodeURIComponent("http://mycloud-staging.autodesk.com:8080/aknuserservices/resources/html/CloseWin.html");
	        var data ="identifier=http://accounts.autodesk.com&returnUrl="+ returnConsumerUrl +"&stateLess="+stateLess+"&pluckCookie="+pluckCookie;


		         $.ajax({
		              data: data,
		              url: userServiceUrl+"/aknuserservices/user/openid/checkidimmediate",
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
				 // myLoginCheckFunction();
					 $.each(data, function(key, val) {
				 				  console.log("key is" + key);
				 				    console.log("value is" + val);


					});

					if(!stateLess && data["CONSUMER_RESPONSE_DATA"] ){
						console.log("local copy of data found " + data["CONSUMER_RESPONSE_DATA"]);
						alert("local copy of data found " + data["CONSUMER_RESPONSE_DATA"]);
					}
					else if(data["REDIRECT_URL"]){
						var url =data["REDIRECT_URL"];
						var popupOpener = popupManager.createPopupOpener(myLoginCheckFunction, url);
						popupOpener.popup(450,500);
				 	}
				}

			});
	}

	function myLoginCheckFunction() {
			alert("called login check function");
		/*	$.ajax({
	            url: "return.jsp?size=short",
	            cache: false,
	            success: function(response) {
	              $("#welcomePane").html(response);
	              $("#welcomePane").Focus();
	            }
	        });*/
	}

	 function getUserData(userid) {


		      var data ="userid=P33RQK4NHSBT";
		   $.ajax({
			data: data,
			url: userServiceUrl+"/aknuserservices/user/openid/getuserdata",
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

				if(key == "CONSUMER_RESPONSE_DATA"){

				    $.each(data["CONSUMER_RESPONSE_DATA"], function(key, val){
					 console.log("key is" + key);
					    console.log("value is" + val);
				    });
				}
			});
		       }
		     });
	             }


	              function signOff(pluckCookie,userid) {

		     	            var data ="pluckCookie="+pluckCookie+"&userid=P33RQK4NHSBT";
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
		     	             	$.each(data, function(key, val) {
		     				   console.log("key is" + key);
		     				    console.log("value is" + val);
		     				});
		     	               }
		     	             });
	             }

      </script>

      	<!-- Pluck  ---->
            	    <script type="text/javascript" src="http://pluckstage.autodesk.com/ver1.0/Content/ua/scripts/pluckApps.js?skipCSS=true"></script>
            	    <link rel="stylesheet" type="text/css" href="http://pluckstage.autodesk.com/ver1.0/content/ua/css/pluckAll.css" />
            	    <!--[if IE 6]>
            	                        <link rel="stylesheet" type="text/css" href="http://pluckstage.autodesk.com/ver1.0/content/ua/css/pluckAll.ie6.css" />
            	    <![endif]-->

      	   <!-- Pluck  ---->
             <!-- Pluck  ---->
                <script type="text/javascript">
                    pluckAppProxy.embedApp("pluck_reviews_list", {
                        plckArticleTitle: 'title',
                        plckArticleUrl: 'url',
                        plckDiscoveryCategories: "inventor, getting started",
                        plckDiscoverySection: "software",
                        plckReviewOnKey: 'key',
                        plckReviewOnKeyType: "article"
                    });
                </script>

<!-- Pluck  ---->
     </body>
</html>
<body>
