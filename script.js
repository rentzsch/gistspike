var cookieName = 'gistSpike.oauth';

$(document).ready(function(){
    if (readCookie(cookieName)) {
        console.log('signed in');
        $('#sign-in-button').hide();
    } else {
        console.log('signed out');
        $('#sign-out-button').hide();
    }
    
    var oauthCode = window.location.search.match(/code=(.+)/);
    if (oauthCode) {
        console.log('oauth code detected, storing '+oauthCode[1]);
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
});

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