function loadVideoData { 
	
	alert("loading video");

	var playerInstance = jwplayer('myElement1');
	
	function invokeVideoPlayer(url) {
	    // this calls setup on the player we initialized
	    // this will use the settings defined in the player we loaded above unless you override them here
	    playerInstance.setup({
	        // this line loads a playlist from your jwplatform account (in either json or rss format)
	        // this can also be a single media file by specifying "file" : "content.jwplatform.com/videos/VIDEOKEY.mp4"
	        // Replace this with the correct url for your playlist
	        "playlist": "https://content.jwplatform.com/feeds/ae4tmw2D.json",
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