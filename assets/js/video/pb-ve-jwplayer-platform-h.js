function loadVideoData() { 
	
	var pbjs = pbjs || {};
    pbjs.que = pbjs.que || [];

    // define invokeVideoPlayer in advance in case we get the bids back from prebid before the entire page loads
    var tempTag = false;
    var invokeVideoPlayer = function(url) {
        tempTag = url;
    }

    var videoAdUnit = {
        code: 'video1',
        mediaTypes: {
            video: {
                playerSize: [640, 480],
                context: 'instream'
            }
        },
        bids: [{
            bidder: 'appnexus',
            params: {
                placementId: 13232361, // Add your own placement id here
                video: {
                    skipppable: true,
                    playback_method: ['auto_play_sound_off']
                }
            }
        }]
    };

    pbjs.que.push(function() {
        pbjs.addAdUnits(videoAdUnit); // add your ad units to the bid request

        pbjs.setConfig({
            debug: true,
            cache: {
                url: 'https://prebid.adnxs.com/pbc/v1/cache'
            }
        });

        pbjs.requestBids({
            bidsBackHandler: function(bids) {
                var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
                    adUnit: videoAdUnit,
                    params: {
                        iu: '/19968336/prebid_cache_video_adunit',
                        cust_params: {
                            section: 'blog',
                            anotherKey: 'anotherValue'
                        },
                        output: 'vast'
                    }
                });
                invokeVideoPlayer(videoUrl);
            }
        });
    });

}