var cookieName = 'gistSpike.oauth';

$(document).ready(function(){
    if (readCookie(cookieName)) {
        // signed in
        $('#signed-out').hide();
        $('#signed-in').show();
    }
    
    var oauthCode = window.location.search.match(/code=(.+)/);
    if (oauthCode) {
        createCookie(cookieName, oauthCode[1]);
        // Remove 'code=' from the url:
        window.location = window.location.origin + window.location.pathname;
    }
    
	$('#sign-in-button').click(function(){
		window.location = 'https://github.com/login/oauth/authorize?client_id=17d941ffa650bd861e83&scope=gist';
	});
    
	$('#sign-out-button').click(function(){
		eraseCookie(cookieName);
		window.location.reload();
	});
    
	$('#create-button').click(function(){
		console.log(
		  'creating gist "'
		  +gistName()
		  +'" with value "'
		  +gistValue()
		  +'"');
		  
        $.ajax({
            type: 'POST',
            url: 'https://api.github.com/gists',
            headers: {
                'Accept': 'application/vnd.github.raw',
                'Authorization': 'token '+readCookie(cookieName),
            },
            contentType: 'json',
            processData: false,
            data: JSON.stringify({
                'description': 'pergist-spike-'+gistName(),
                'public': false,
                'files': {
                    'data.txt': {
                        'content': gistValue()
                    },
                }
            }),
            //--
            dataType: 'json',
            //cache: false, // not for POST
            complete: function(jqXHR, textStatus){
                console.log(jqXHR, textStatus);
                $('#output').text(textStatus);
            },
        });
        //jQuery.post( url [, data ] [, success(data, textStatus, jqXHR) ] [, dataType ] )
        /*$.post(
            'https://api.github.com/gists',
            JSON.stringify({
                "description": "pergist-spike",
                "public": false,
                "files": {
                    "data.txt": {
                        "content": gistValue()
                    }
                }
            }),
            function(data, textStatus, jqXHR){
                ;
            },
            'json');*/
	});
    
	$('#read-button').click(function(){
		console.log(
		  'fetching gist "'
		  +gistName()
		  +'" with value "'
		  +gistValue()
		  +'"');
	});
    
	$('#update-button').click(function(){
		console.log(
		  'updating gist "'
		  +gistName()
		  +'" with value "'
		  +gistValue()
		  +'"');
	});
    
	$('#delete-button').click(function(){
		console.log(
		  'deleting gist "'
		  +gistName()
		  +'"');
	});
});

function gistName() {
    return $('input[name=gist-name]').val();
}

function gistValue() {
    return $('textarea[name=gist-value]').val();
}

// from http://www.quirksmode.org/js/cookies.html:
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}