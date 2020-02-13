var pbjs = pbjs || {};
pbjs.que = pbjs.que || [];

// define invokeVideoPlayer in advance in case we get the bids back from prebid before the entire page loads
var tempTag = false;
var invokeVideoPlayer = function(url){
  tempTag = url;
}

/*
Prebid Video adUnit
*/

var videoAdUnit = {
  code: 'video1',
  sizes: [640,480],
  mediaTypes: {
    video: {
      context: "instream"
    }
  },
  bids: [
    {
      bidder: 'appnexusAst',
      params: {
        placementId: '13232361', // Add your own placement id here
        video: {
          skipppable: true,
          playback_method: ['auto_play_sound_off']
        }
      }
    }
  ]
};

pbjs.que.push(function(){
  pbjs.addAdUnits(videoAdUnit); // add your ad units to the bid request

  pbjs.setConfig({ 
    usePrebidCache: true 
  });

  pbjs.requestBids({
      bidsBackHandler: function(bids) {
          var videoUrl = pbjs.adServers.dfp.buildVideoUrl({
              adUnit: videoAdUnit,
              params: {
                  iu: '/19968336/prebid_cache_video_adunit',
                  cust_params: {
                    section: "blog",
                    anotherKey: "anotherValue"
                  },
                  output: "vast"
              }
          });
          invokeVideoPlayer(videoUrl);
      }
  });
});

pbjs.bidderSettings =
{
    standard: {
        adserverTargeting: [
            {
                key: "hb_bidder",
                val: function (bidResponse) {
                    return bidResponse.bidderCode;
                }
            }, {
                key: "hb_adid",
                val: function (bidResponse) {
                    return bidResponse.adId;
                }
            }, {
                key: "hb_pb",
                val: function (bidResponse) {
                    return "10.00";
                }
            }, {
                key: "hb_size",
                val: function (bidResponse) {
                    return bidResponse.size;

                }
            }
        ]
    }
};
