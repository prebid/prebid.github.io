function loadVideoData { 
	
	alert("loading video");

	var playerInstance = jwplayer('myElement1');
	
	function invokeVideoPlayer(url) {
	    // this calls setup on the player we initialized
	    // this will use the settings defined in the player we loaded above unless you override them here
	    playerInstance.setup({
                "file": "https://vjs.zencdn.net/v/oceans.mp4",
                // or "file" could be replaced with "playlist" and a URL
                // from your JW Platform account in either json or rss format.
	        "width": 640,
	        "height": 480,
	        // we enable vast advertising for this player
	        "advertising": {
	            "client": "vast",
	            // url is the vast tag url that we passed in when we called invokeVideoPlayer in the header
	            "tag": url,
	        },
	    });
	}
	
	if (tempTag) {
	    invokeVideoPlayer(tempTag);
	    tempTag = false;
	}
	
}
